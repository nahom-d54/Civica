import { getServerSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { votes } from "@/lib/db/schema";
import { voteUpdateSchema } from "@/lib/validations/vote";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  params: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params.params;
    const body = await request.json();

    const data = voteUpdateSchema.safeParse(body);
    if (!data.success) {
      return NextResponse.json(
        { error: "Invalid data", issues: data.error.issues },
        { status: 400 }
      );
    }
    const vote = await db.query.votes.findFirst({
      where: and(eq(votes.id, id), eq(votes.userId, session?.user.id)),
    });
    if (!vote) {
      return NextResponse.json({
        error: "Vote not found or you do not have permission to modify vote",
      });
    }
    const [updatedVote] = await db
      .update(votes)
      .set({
        choice: data.data.choice,
      })
      .where(and(eq(votes.id, id), eq(votes.userId, session?.user.id)))
      .returning();

    return NextResponse.json({ vote: updatedVote }, { status: 200 });
  } catch (error) {
    console.error("Error updating vote:", error);
    return NextResponse.json(
      { error: "Failed to update vote" },
      { status: 500 }
    );
  }
}
