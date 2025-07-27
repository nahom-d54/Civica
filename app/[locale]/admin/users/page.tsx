import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getServerSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { admins } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import UsersManagementClient from "./users-management-client";

export default async function UsersManagementPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await getServerSession();
  const t = await getTranslations();

  if (!session?.user) {
    redirect(`/${locale}/sign-in`);
  }
  if (session.user.role !== "superadmin") {
    redirect(`/${locale}/admin/dashboard`);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {t("admin.users.title")}
        </h1>
        <p className="text-gray-600 mt-2">{t("admin.users.description")}</p>
      </div>
      <UsersManagementClient locale={locale} superadmin={session.user} />
    </div>
  );
}
