import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { user, proposals } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import FeedbackNewClient from "./feedback-new-client";
import { ReactQueryProvider } from "@/components/ReactQueryProvider";

export default async function FeedbackNewPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ proposal?: string }>;
}) {
  const { locale } = await params;
  const searchParam = (await searchParams).proposal;
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

  // Get proposal if specified
  let proposal = null;
  if (searchParam) {
    proposal = await db.query.proposals.findFirst({
      where: eq(proposals.id, searchParam),
    });
  }

  return (
    <ReactQueryProvider>
      <FeedbackNewClient user={user} proposal={proposal} locale={locale} />
    </ReactQueryProvider>
  );
}
