import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { user, admins } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import AdminSidebar from "./admin-sidebar";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect(`/${locale}/sign-in`);
  }

  // Check if user is admin
  const userData = await db.query.user.findFirst({
    where: eq(user.id, session.user.id),
  });

  if (!userData) {
    redirect(`/${locale}/sign-in`);
  }

  const adminRole = await db.query.admins.findFirst({
    where: eq(admins.userId, userData.id),
  });

  if (!adminRole) {
    redirect(`/${locale}/dashboard`);
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar adminRole={adminRole} locale={locale} />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
