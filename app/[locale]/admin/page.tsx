import { auth, getServerSession } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { proposals, votes, feedback, user, admins } from "@/lib/db/schema";
import { eq, count, and, gte } from "drizzle-orm";
import AdminDashboardClient from "./admin-dashboard-client";
import { redirect } from "next/navigation";
import { ReactQueryProvider } from "@/components/ReactQueryProvider";

export default async function AdminDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await getServerSession();

  if (!session) {
    redirect(`/${locale}/sign-in`);
  }

  // Get admin role
  const adminRole = await db.query.admins.findFirst({
    where: eq(admins.userId, session.user.id),
  });

  // Get statistics
  const [
    totalProposals,
    activeProposals,
    totalVotes,
    pendingFeedback,
    totalUsers,
  ] = await Promise.all([
    db.select({ count: count() }).from(proposals),
    db
      .select({ count: count() })
      .from(proposals)
      .where(
        and(eq(proposals.isActive, true), gte(proposals.endsAt, new Date()))
      ),
    db.select({ count: count() }).from(votes),
    db
      .select({ count: count() })
      .from(feedback)
      .where(eq(feedback.status, "pending")),
    db.select({ count: count() }).from(user),
  ]);

  // Get recent proposals
  const recentProposals = await db.query.proposals.findMany({
    with: {
      creator: true,
    },
    orderBy: (proposals, { desc }) => [desc(proposals.createdAt)],
    limit: 5,
  });

  // Get recent feedback
  const recentFeedback = await db.query.feedback.findMany({
    with: {
      user: true,
    },
    orderBy: (feedback, { desc }) => [desc(feedback.submittedAt)],
    limit: 5,
  });

  const stats = {
    totalProposals: totalProposals[0].count,
    activeProposals: activeProposals[0].count,
    totalVotes: totalVotes[0].count,
    pendingFeedback: pendingFeedback[0].count,
    totalUsers: totalUsers[0].count,
  };

  return (
    <ReactQueryProvider>
      <AdminDashboardClient
        stats={stats}
        recentProposals={recentProposals}
        recentFeedback={recentFeedback}
        adminRole={adminRole}
      />
    </ReactQueryProvider>
  );
}
