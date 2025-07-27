import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { proposals, user, admins } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import ProposalsManagementClient from "./proposals-management-client";

export default async function ProposalsManagementPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const adminRole = await db.query.admins.findFirst({
    where: eq(admins.userId, session!.user.id),
  });

  // Get all proposals with creator information
  const allProposals = await db.query.proposals.findMany({
    with: {
      creator: true,
    },
    orderBy: [desc(proposals.createdAt)],
  });

  return (
    <ProposalsManagementClient
      proposals={allProposals}
      adminRole={adminRole}
      locale={locale}
    />
  );
}
