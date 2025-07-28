import { auth, getServerSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { admins, proposals } from "@/lib/db/schema";
import {
  checkAdminCreateProposalPermission,
  checkAdminRole,
} from "@/lib/utils";
import { proposalSchema } from "@/lib/validations/proposal";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  params: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params.params;
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!checkAdminRole(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const body = await request.json();
    const data = proposalSchema.safeParse(body);
    if (!data.success) {
      return NextResponse.json(
        { error: "Invalid data", issues: data.error.issues },
        { status: 400 }
      );
    }
    const adminRole = await db.query.admins.findFirst({
      where: eq(admins.userId, session.user.id),
    });
    if (!adminRole) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (
      !checkAdminCreateProposalPermission(
        session.user.role,
        data.data.scope,
        adminRole.permissions
      )
    ) {
      return NextResponse.json({ error: "Permission Denied" }, { status: 403 });
    }

    const [insertedData] = await db
      .update(proposals)

      .set({
        title: data.data.title,
        description: data.data.description,
        createdBy: session.user.id,
        scope: data.data.scope,
        target: data.data.target,
        category: data.data.category,
        startsAt: new Date(data.data.startsAt),
        endsAt: new Date(data.data.endsAt),
      })
      .where(
        and(eq(proposals.id, id), eq(proposals.createdBy, session.user.id))
      )
      .returning();

    return NextResponse.json({ proposal: insertedData }, { status: 200 });
  } catch (error) {
    console.error("Error updating proposal:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  params: { params: Promise<{ id: string }> }
) {
  const { id } = await params.params;
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!checkAdminRole(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const superAdmin = session.user.role === "superadmin";

    const proposal = await db.query.proposals.findFirst({
      where: and(
        eq(proposals.id, id),
        ...(superAdmin ? [] : [eq(proposals.createdBy, session.user.id)])
      ),
    });

    if (!proposal) {
      return NextResponse.json(
        { error: "Proposal not found" },
        { status: 404 }
      );
    }

    if (
      proposal.createdBy !== session.user.id ||
      session.user.role === "superadmin"
    ) {
      return NextResponse.json({
        error: "Proposal does not exist or you don't have permission",
      });
    }

    await db.update(proposals).set({
      isDeleted: true,
      deletedBy: session.user.id,
      deletedAt: new Date(),
      isActive: false,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting proposal:", error);
    return NextResponse.json(
      { error: "Failed to delete proposal" },
      { status: 500 }
    );
  }
}
