import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { implementations } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      status,
      progressPercentage,
      budgetAllocated,
      budgetSpent,
      startDate,
      expectedCompletion,
      actualCompletion,
      notes,
    } = await request.json();

    await db
      .update(implementations)
      .set({
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
        updatedAt: new Date(),
      })
      .where(eq(implementations.id, params.id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating implementation:", error);
    return NextResponse.json(
      { error: "Failed to update implementation" },
      { status: 500 }
    );
  }
}
