import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { proposals, votes, user, admins, feedback } from "@/lib/db/schema";
import { eq, and, gte, desc } from "drizzle-orm";
import DashboardClient from "./dashboard-client";
import type { localeType } from "@/lib/types";
import { ReactQueryProvider } from "@/components/ReactQueryProvider";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: localeType }>;
}) {
  const { locale } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect(`/${locale}/sign-in`);
  }

  // Get user data
  const userData = await db.query.user.findFirst({
    where: eq(user.id, session.user.id),
    with: {
      votes: true,
      feedback: {
        orderBy: [desc(feedback.submittedAt)],
        limit: 5,
      },
      fayda: true, // Fetch fayda data if exists
    },
  });

  if (!userData) {
    redirect(`/${locale}/sign-in`);
  }

  // Check if user is admin
  const adminRole = await db.query.admins.findFirst({
    where: eq(admins.userId, userData.id),
  });

  if (adminRole) {
    redirect(`/${locale}/admin`);
  }

  // Get active proposals
  const activeProposals = await db.query.proposals.findMany({
    where: and(eq(proposals.isActive, true), gte(proposals.endsAt, new Date())),
    with: {
      creator: true,
    },
    orderBy: [desc(proposals.createdAt)],
  });

  // Get recent feedback
  const recentFeedback = await db.query.feedback.findMany({
    where: eq(votes.userId, userData.id),
    orderBy: [desc(feedback.updatedAt)],
    limit: 5,
  });

  return (
    <ReactQueryProvider>
      <DashboardClient
        user={userData}
        proposals={activeProposals || []}
        userVotes={userData.votes || []}
        recentFeedback={recentFeedback || []}
        locale={locale}
        fayda={userData.fayda || {}} // Pass fayda data if exists
      />
    </ReactQueryProvider>
  );
}
