import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound, redirect } from "next/navigation";
import { routing } from "@/i18n/routing";
import "@/app/globals.css";
import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { user } from "@/auth-schema";
import { getServerSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Civica - Digital Voting & Community Feedback",
  description:
    "Secure digital voting and community feedback platform for Ethiopian citizens using Fayda ID verification",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  const session = await getServerSession();
  if (!session) {
    const superadmin = await db.query.user.findFirst({
      where: eq(user.role, "superadmin"),
    });
    if (!superadmin) {
      redirect("/install");
    }
  }

  const superadmin = await db.query.user.findFirst({
    where: eq(user.role, "superadmin"),
  });
  if (!superadmin) {
    redirect("/install");
  }

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider>
          {children}
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
