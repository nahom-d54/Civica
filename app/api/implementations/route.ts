import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { admins, implementations, proposals } from "@/lib/db/schema";
import { getServerSession } from "@/lib/auth";
import { checkAdminRole } from "@/lib/utils";
import { implementationSchema } from "@/lib/validations/implimentation";
import { and, eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!checkAdminRole(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const body = await request.json();
    const data = implementationSchema.safeParse(body);
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
    const proposal = await db.query.proposals.findFirst({
      where: and(
        eq(proposals.id, data.data.proposalId),
        eq(proposals.createdBy, session.user.id)
      ),
    });

    if (!proposal) {
      return NextResponse.json(
        { error: "No proposal or You don't have perrmission" },
        { status: 403 }
      );
    }

    const [newProposal] = await db
      .insert(implementations)
      .values({
        proposalId: data.data.proposalId,
        status: data.data.status,
        progressPercentage: data.data.progressPercentage,
        budgetAllocated: data.data.budgetAllocated,
        budgetSpent: data.data.budgetSpent,
        startDate: data.data.startDate,
        expectedCompletion: data.data.expectedCompletion,
        actualCompletion: data.data.actualCompletion,
        notes: data.data.notes,
        updatedBy: session.user.id,
      })
      .returning();

    return NextResponse.json({ success: true, proposal: newProposal });
  } catch (error) {
    console.error("Error creating implementation:", error);
    return NextResponse.json(
      { error: "Failed to create implementation" },
      { status: 500 }
    );
  }
}
