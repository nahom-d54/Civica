import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { user, admins } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import AdminSidebar from "./admin-sidebar";
import { checkAdminRole } from "@/lib/utils";

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

  console.log("Session User:", session.user);
  if (!checkAdminRole(session.user.role)) {
    redirect(`/${locale}/dashboard`);
  }

  const adminRole = await db.query.admins.findFirst({
    where: eq(admins.userId, session.user.id),
  });

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar adminRole={adminRole} locale={locale} user={session.user} />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
