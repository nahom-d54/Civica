import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { votes, proposals } from "@/lib/db/schema"
import { eq, sql } from "drizzle-orm"

export async function POST(request: NextRequest) {
  try {
    const { proposalId, choice, userId } = await request.json()

    // Insert the vote
    await db.insert(votes).values({
      userId,
      proposalId,
      choice,
    })

    // Update proposal vote counts
    const voteCount = await db
      .select({
        total: sql<number>`count(*)`,
        yes: sql<number>`count(*) filter (where choice = 'yes')`,
        no: sql<number>`count(*) filter (where choice = 'no')`,
        abstain: sql<number>`count(*) filter (where choice = 'abstain')`,
      })
      .from(votes)
      .where(eq(votes.proposalId, proposalId))

    if (voteCount[0]) {
      await db
        .update(proposals)
        .set({
          totalVotes: voteCount[0].total,
          yesVotes: voteCount[0].yes,
          noVotes: voteCount[0].no,
          abstainVotes: voteCount[0].abstain,
        })
        .where(eq(proposals.id, proposalId))
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error submitting vote:", error)
    return NextResponse.json({ error: "Failed to submit vote" }, { status: 500 })
  }
}
