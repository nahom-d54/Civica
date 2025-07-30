import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import {
  proposals,
  votes,
  user,
  admins,
  feedback,
  fayda,
} from "@/lib/db/schema";
import { eq, and, gte, desc } from "drizzle-orm";
import DashboardClient from "./dashboard-client";
import type { localeType } from "@/lib/types";
import { ReactQueryProvider } from "@/components/ReactQueryProvider";
import { updateFaydaUserProfile } from "@/lib/authUtils";
import { getPropsals } from "@/lib/internal/proposals";

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

  const faydaData = await db.query.fayda.findFirst({
    where: eq(fayda.userId, userData.id),
  });
  if (userData.role !== "user") return redirect(`/${locale}/admin`);

  if (!faydaData && userData.role === "user") {
    const userFayda = await auth.api.accountInfo({
      body: {
        accountId: userData.fayda_id as string,
      },
      headers: await headers(),
    });

    if (!userFayda || !userFayda.data) {
      throw new Error("Failed to fetch user data from provider");
    }

    await updateFaydaUserProfile({
      sub: userData.id as string,
      name: userFayda.data.name as string,
      email: userFayda.data.email as string,
      birthdate: userFayda.data.birthdate as string,
      address: {
        zone: userFayda.data.address.zone as string,
        woreda: userFayda.data.address.woreda as string,
        region: userFayda.data.address.region as string,
      },
      phone_number: userFayda.data.phone_number as string,
      nationality: userFayda.data.nationality as string,
    });
  }

  // Check if user is admin
  const adminRole = await db.query.admins.findFirst({
    where: eq(admins.userId, userData.id),
  });

  if (adminRole) {
    redirect(`/${locale}/admin`);
  }

  // Get active proposals
  const activeProposals = await getPropsals(userData);
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
