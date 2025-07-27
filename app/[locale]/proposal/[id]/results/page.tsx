import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { proposals, votes, feedback } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import ResultsClient from "./results-client";
import { ReactQueryProvider } from "@/components/ReactQueryProvider";

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect(`/${locale}/sign-in`);
  }

  // Get proposal data
  const proposal = await db.query.proposals.findFirst({
    where: eq(proposals.id, id),
    with: {
      creator: true,
    },
  });

  if (!proposal) {
    redirect(`/${locale}/dashboard`);
  }

  // Get detailed voting statistics
  const voteStats = await db
    .select({
      choice: votes.choice,
      count: sql<number>`count(*)`,
    })
    .from(votes)
    .where(eq(votes.proposalId, id))
    .groupBy(votes.choice);

  // Get regional breakdown (mock data for now)
  const regionalBreakdown = [
    { region: "Addis Ababa", yes: 45, no: 12, abstain: 8, total: 65 },
    { region: "Oromia", yes: 38, no: 15, abstain: 5, total: 58 },
    { region: "Amhara", yes: 42, no: 8, abstain: 7, total: 57 },
  ];

  // Get related feedback
  const relatedFeedback = await db.query.feedback.findMany({
    where: eq(feedback.proposalId, id),
    with: {
      user: true,
    },
    limit: 10,
  });

  return (
    <ReactQueryProvider>
      <ResultsClient
        proposal={proposal}
        voteStats={voteStats}
        regionalBreakdown={regionalBreakdown}
        relatedFeedback={relatedFeedback}
        locale={locale}
      />
    </ReactQueryProvider>
  );
}
