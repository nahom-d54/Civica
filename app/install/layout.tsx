import { redirect } from "next/navigation";
import "@/app/globals.css";
import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { appState } from "@/lib/db/schema";

export const metadata: Metadata = {
  title: "Civica - Digital Voting & Community Feedback",
  description:
    "Secure digital voting and community feedback platform for Ethiopian citizens using Fayda ID verification",
};

export default async function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const appStateStatus = await db.query.appState.findFirst({
    where: eq(appState.installed, true),
  });

  if (appStateStatus) {
    // System is already installed, redirect to main page
    redirect("/");
  }
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
