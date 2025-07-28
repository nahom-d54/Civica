import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { votes, proposals } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { voteSchema } from "@/lib/validations/vote";
import { getServerSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();

    const data = voteSchema.safeParse(body);

    if (!data.success) {
      return NextResponse.json(
        { error: "Invalid data", issues: data.error.issues },
        { status: 400 }
      );
    }

    // Insert the vote
    await db.insert(votes).values({
      userId: session.user.id,
      proposalId: data.data.proposalId,
      choice: data.data.choice,
    });

    // Update proposal vote counts
    const voteCount = await db
      .select({
        total: sql<number>`count(*)`,
        yes: sql<number>`count(*) filter (where choice = 'yes')`,
        no: sql<number>`count(*) filter (where choice = 'no')`,
        abstain: sql<number>`count(*) filter (where choice = 'abstain')`,
      })
      .from(votes)
      .where(eq(votes.proposalId, data.data.proposalId));

    if (voteCount[0]) {
      await db
        .update(proposals)
        .set({
          totalVotes: voteCount[0].total,
          yesVotes: voteCount[0].yes,
          noVotes: voteCount[0].no,
          abstainVotes: voteCount[0].abstain,
        })
        .where(eq(proposals.id, data.data.proposalId));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error submitting vote:", error);
    return NextResponse.json(
      { error: "Failed to submit vote" },
      { status: 500 }
    );
  }
}
