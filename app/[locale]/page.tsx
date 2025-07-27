import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import LandingPage from "./landing-page";
import { checkAdminRole } from "@/lib/utils";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const { locale } = await params;

  if (!session) {
    redirect(`/${locale}/sign-in`);
  }

  if (checkAdminRole(session?.user?.role)) {
    redirect(`/${locale}/admin`);
  }

  if (session) {
    redirect(`/${locale}/dashboard`);
  }

  return <LandingPage locale={locale} />;
}
