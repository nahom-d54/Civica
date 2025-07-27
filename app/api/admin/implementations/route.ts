import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { implementations } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      proposalId,
      status,
      progressPercentage,
      budgetAllocated,
      budgetSpent,
      startDate,
      expectedCompletion,
      actualCompletion,
      notes,
    } = await request.json();

    await db.insert(implementations).values({
      proposalId,
      status,
      progressPercentage,
      budgetAllocated: budgetAllocated
        ? Number.parseFloat(budgetAllocated)
        : null,
      budgetSpent: budgetSpent ? Number.parseFloat(budgetSpent) : null,
      startDate: startDate ? new Date(startDate) : null,
      expectedCompletion: expectedCompletion
        ? new Date(expectedCompletion)
        : null,
      actualCompletion: actualCompletion ? new Date(actualCompletion) : null,
      notes,
      updatedBy: session.user.id,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error creating implementation:", error);
    return NextResponse.json(
      { error: "Failed to create implementation" },
      { status: 500 }
    );
  }
}
