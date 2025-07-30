import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { implementations } from "@/lib/db/schema";
import { auth, getServerSession } from "@/lib/auth";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import {
  implementationSchema,
  implementationSchemaBackend,
} from "@/lib/validations/implimentation";

export async function PUT(
  request: NextRequest,
  params: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params.params;
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const data = implementationSchemaBackend.safeParse(body);
    if (!data.success) {
      return NextResponse.json({
        error: "Invalid data",
      });
    }
    let effectivestatus: any = data.data.status;
    if (effectivestatus !== "cancelled" || effectivestatus !== "completed") {
      if (
        data.data.progressPercentage > 0 &&
        data.data.progressPercentage < 100
      ) {
        effectivestatus = "in-progress";
      }
      if (data.data.progressPercentage === 100) {
        effectivestatus = "completed";
      }
    }

    await db
      .update(implementations)
      .set({
        status: effectivestatus,
        progressPercentage: data.data.progressPercentage,
        budgetAllocated: data.data.budgetAllocated,
        budgetSpent: data.data.budgetSpent,
        startDate: data.data.startDate.toISOString(),
        expectedCompletion: data.data.expectedCompletion.toISOString(),
        actualCompletion: data.data.actualCompletion?.toISOString(),
        notes: data.data.notes,
        updatedBy: session.user.id,
        updatedAt: new Date(),
      })
      .where(eq(implementations.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating implementation:", error);
    return NextResponse.json(
      { error: "Failed to update implementation" },
      { status: 500 }
    );
  }
}
