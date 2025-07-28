import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { admins, proposals, user } from "@/lib/db/schema";
import {
  checkAdminCreateProposalPermission,
  checkAdminRole,
} from "@/lib/utils";
import { proposalSchema } from "@/lib/validations/proposal";
import { and, desc, eq, gte, or } from "drizzle-orm";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userData = await db.query.user.findFirst({
      where: eq(user.id, session.user.id),
      with: {
        fayda: true, // Fetch fayda data if exists
      },
    });

    const proposalData = await db.query.proposals.findMany({
      where: and(
        eq(proposals.isActive, true),
        eq(proposals.isDeleted, false),
        gte(proposals.endsAt, new Date()),
        or(
          eq(proposals.scope, "national"),
          and(
            eq(proposals.scope, "regional"),
            eq(proposals.target, userData?.fayda.region as string)
          ),
          and(
            eq(proposals.scope, "zoneOrSubcity"),
            eq(proposals.target, userData?.fayda.zoneOrSubcity as string)
          ),
          and(
            eq(proposals.scope, "woreda"),
            eq(proposals.target, userData?.fayda.woreda as string)
          )
        )
      ),
      orderBy: [desc(proposals.createdAt)],
      with: {
        creator: true,
      },
    });

    return NextResponse.json({ proposals: proposalData }, { status: 200 });
  } catch (error) {
    console.error("Error fetching proposals:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
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
      .insert(proposals)
      .values({
        title: data.data.title,
        description: data.data.description,
        createdBy: session.user.id,
        scope: data.data.scope,
        target: data.data.target,
        category: data.data.category,
        startsAt: new Date(data.data.startsAt),
        endsAt: new Date(data.data.endsAt),
      })
      .returning();

    return NextResponse.json({ proposal: insertedData }, { status: 201 });
  } catch (error) {
    console.error("Error fetching proposals:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
