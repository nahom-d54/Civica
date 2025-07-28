import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { proposals } from "@/lib/db/schema";
import { auth, getServerSession } from "@/lib/auth";
import { headers } from "next/headers";
import { and, eq } from "drizzle-orm";
import { checkAdminRole } from "@/lib/utils";

export async function PATCH(
  request: NextRequest,
  params: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params.params;
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { isActive } = await request.json();
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

    if (proposal.createdBy !== session.user.id || superAdmin) {
      return NextResponse.json({
        error: "Proposal does not exist or you don't have permission",
      });
    }

    await db
      .update(proposals)
      .set({
        isActive,
        updatedAt: new Date(),
      })
      .where(eq(proposals.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error toggling proposal status:", error);
    return NextResponse.json(
      { error: "Failed to toggle proposal status" },
      { status: 500 }
    );
  }
}
