import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { implementations, admins } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import ImplementationsManagementClient from "./implementations-management-client";
import { ReactQueryProvider } from "@/components/ReactQueryProvider";

export default async function ImplementationsManagementPage({
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

  // Get all implementations with proposal information
  const allImplementations = await db.query.implementations.findMany({
    with: {
      proposal: {
        with: {
          creator: true,
        },
      },
    },
    orderBy: [desc(implementations.updatedAt)],
  });

  // Get proposals that don't have implementations yet
  const proposalsWithoutImplementations = await db.query.proposals.findMany({
    where: (proposals, { notExists, eq }) =>
      notExists(
        db
          .select()
          .from(implementations)
          .where(eq(implementations.proposalId, proposals.id))
      ),
    with: {
      creator: true,
    },
  });

  return (
    <ReactQueryProvider>
      <ImplementationsManagementClient
        implementations={allImplementations}
        proposalsWithoutImplementations={proposalsWithoutImplementations}
        adminRole={adminRole}
      />
    </ReactQueryProvider>
  );
}
