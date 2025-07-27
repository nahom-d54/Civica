import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { auth, getServerSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { admins } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import AnalyticsClient from "./analytics-client";
import { checkAdminRole } from "@/lib/utils";

export default async function AnalyticsPage({
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
  if (!checkAdminRole(session.user.role)) {
    redirect(`/${locale}/dashboard`);
  }

  // Check if user is admin
  const adminRole = await db.query.admins.findFirst({
    where: eq(admins.userId, session.user.id),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {t("admin.analytics.title")}
        </h1>
        <p className="text-gray-600 mt-2">{t("admin.analytics.description")}</p>
      </div>
      <AnalyticsClient locale={locale} adminRole={adminRole} />
    </div>
  );
}
