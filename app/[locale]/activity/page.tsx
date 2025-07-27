import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { votes, feedback, user } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import ActivityClient from "./activity-client";

export default async function ActivityPage({
  params,
}: {
  params: Promise<{ locale: string }>;
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
  });

  if (!userData) {
    redirect(`/${locale}/sign-in`);
  }

  // Get user's voting history
  const userVotes = await db.query.votes.findMany({
    where: eq(votes.userId, userData.id),
    with: {
      proposal: true,
    },
    orderBy: [desc(votes.votedAt)],
  });

  // Get user's feedback history
  const userFeedback = await db.query.feedback.findMany({
    where: eq(feedback.userId, userData.id),
    orderBy: [desc(feedback.submittedAt)],
  });

  return (
    <ActivityClient
      user={userData}
      votes={userVotes}
      feedback={userFeedback}
      locale={locale}
    />
  );
}
