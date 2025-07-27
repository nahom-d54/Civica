import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { proposals, user } from "@/lib/db/schema";
import { and, desc, eq, gte, or } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userData = await db.query.user.findFirst({
      where: eq(user.id, session.user.id),
      with: {
        fayda: true, // Fetch fayda data if exists
      },
    });

    const proposalData = await db.query.proposals.findMany({
      where: and(
        eq(proposals.isActive, true),
        eq(proposals.isDeleted, false),
        gte(proposals.endsAt, new Date()),
        or(
          eq(proposals.scope, "national"),
          and(
            eq(proposals.scope, "regional"),
            eq(proposals.target, userData?.fayda.region as string)
          ),
          and(
            eq(proposals.scope, "zoneOrSubcity"),
            eq(proposals.target, userData?.fayda.zoneOrSubcity as string)
          ),
          and(
            eq(proposals.scope, "woreda"),
            eq(proposals.target, userData?.fayda.woreda as string)
          )
        )
      ),
      orderBy: [desc(proposals.createdAt)],
      with: {
        creator: true,
      },
    });

    return NextResponse.json({ proposals: proposalData }, { status: 200 });
  } catch (error) {
    console.error("Error fetching proposals:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
