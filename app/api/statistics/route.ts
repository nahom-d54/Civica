import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { fayda, implementations, proposals, votes } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(_request: NextRequest) {
  try {
    // Fetch statistics from the database

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const voteCounts = await db
      .select({
        proposalId: votes.proposalId,
        title: proposals.title,
        count: sql<number>`count(*)`.as("count"),
        yes: sql<number>`SUM(CASE WHEN ${votes.choice} = 'yes' THEN 1 ELSE 0 END)`.as(
          "yes"
        ),
        no: sql<number>`SUM(CASE WHEN ${votes.choice} = 'no' THEN 1 ELSE 0 END)`.as(
          "no"
        ),
        abstain:
          sql<number>`SUM(CASE WHEN ${votes.choice} = 'abstain' THEN 1 ELSE 0 END)`.as(
            "abstain"
          ),
      })
      .from(votes)
      .innerJoin(proposals, eq(votes.proposalId, proposals.id))
      .groupBy(votes.proposalId, proposals.title);

    const implementationProgress = await db.query.implementations.findMany({
      columns: {
        proposalId: true,
        status: true,
        progressPercentage: true,
        budgetAllocated: true,
        budgetSpent: true,
        startDate: true,
        expectedCompletion: true,
      },
      where: eq(implementations.isDeleted, false),
      with: {
        proposal: {
          columns: {
            title: true,
          },
        },
      },
    });

    const participationData = await db
      .select({
        region: fayda.region,
        participation: sql<number>`COUNT(*)`.as("participation"),
      })
      .from(votes)
      .innerJoin(fayda, eq(votes.userId, fayda.userId))
      .groupBy(fayda.region);

    const totalVotesCast = voteCounts
      .reduce((acc, obj) => acc + obj.count, 0)
      .toLocaleString();
    const [activeVoters] = await db
      .select({
        count: sql<number>`COUNT(DISTINCT ${votes.userId})`.as("count"),
      })
      .from(votes);

    const participationSubquery = db
      .select({
        participation: sql<number>`COUNT(*)`.as("participation"),
      })
      .from(votes)
      .groupBy(votes.userId)
      .as("participation_subquery");

    const [avgParticipation] = await db
      .select({
        avgParticipation: sql<number>`AVG(participation)`.as(
          "avgParticipation"
        ),
      })
      .from(participationSubquery);

    const byCategory = await db
      .select({
        name: proposals.category,
        value: sql<number>`COUNT(*)`.as("value"),
      })
      .from(proposals)
      .groupBy(proposals.category);

    return NextResponse.json({
      votes: voteCounts,
      implementations: implementationProgress,
      participation: participationData,
      totalVotesCast,
      activeVoters,
      avgParticipation,
      byCategory,
    });
  } catch (error) {
    console.error("Error fetching vote statistics:", error);
    return NextResponse.json(
      { error: "Failed to fetch vote statistics" },
      { status: 500 }
    );
  }
}

export type GetStatisticsResponse = Awaited<ReturnType<typeof GET>>;
