import { auth } from "@/lib/auth";
import { proposalScopes } from "@/lib/constants";
import { db } from "@/lib/db";
import { admins, appState, user } from "@/lib/db/schema";
import { betterAuth } from "better-auth";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const appStateStatus = await db.query.appState.findFirst({
      where: eq(appState.installed, true),
    });

    if (appStateStatus) {
      // System is already installed, redirect to main page
      return NextResponse.redirect(new URL("/", request.url));
    }
    const body = await request.json();
    const {
      name,
      email,
      faydaId,
      password,
      contactInfo,
      siteName,
      siteDescription,

      defaultLanguage,
    } = body;

    const newUser = await auth.api.createUser({
      body: {
        email: email,
        password: password,
        name: name,
        role: "superadmin",
        data: {
          fayda_id: faydaId,
        },
      },
    });
    if (!newUser) {
      throw new Error("Failed to create superadmin user");
    }

    try {
      await db.transaction(async (tx) => {
        await tx.insert(admins).values({
          userId: newUser.user.id,
          assignedRegion: "all",
          assignedZoneOrSubcity: "all",
          assignedWoreda: "all",
          jobDescription: "SuperAdmin",
          contactInfo,
          permissions: Array.from(proposalScopes),
        });

        await db.insert(appState).values({
          installed: true,
          installedAt: new Date(),
          siteName,
          siteDescription,
          appVersion: "1.0.0",
        });
      });
    } catch (error) {
      console.error("Error inserting admin or app state:", error);
      await auth.api.removeUser({
        body: {
          userId: newUser.user.id,
        },
      });

      return NextResponse.json(
        { error: "Failed to initialize application state" },
        { status: 500 }
      );
    }

    // Here you would typically save the installation data to your database
    // For example:
    // await db.insert(appState).values({ installed: true, ...body });

    return new Response("Installation successful", { status: 200 });
  } catch (error) {
    console.error("Installation error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
