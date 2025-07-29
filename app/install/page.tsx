import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import InstallationClient from "./installation-client";
import { eq } from "drizzle-orm";
import { appState } from "@/lib/db/schema";
export default async function InstallationPage() {
  // Check if system is already installed (has any admin users)

  return <InstallationClient />;
}
