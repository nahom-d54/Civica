import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { proposals, votes, user } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import ProposalClient from "./proposal-client";
import { ReactQueryProvider } from "@/components/ReactQueryProvider";

export default async function ProposalPage({
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

  // Get user data
  const singleUser = await db.query.user.findFirst({
    where: eq(user.id, session.user.id),
  });

  if (!singleUser) {
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

  // Check if user has already voted
  const existingVote = await db.query.votes.findFirst({
    where: and(eq(votes.userId, singleUser.id), eq(votes.proposalId, id)),
  });

  return (
    <ReactQueryProvider>
      <ProposalClient
        proposal={proposal}
        user={singleUser}
        existingVote={existingVote}
        locale={locale}
      />
    </ReactQueryProvider>
  );
}
