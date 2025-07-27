import { type NextRequest, NextResponse } from "next/server";
import { auth, getServerSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { admins } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const adminRole = await db.query.admins.findFirst({
      where: eq(admins.userId, session.user.id),
    });

    if (!adminRole) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get("timeRange") || "30d";

    // This would typically fetch real analytics data
    // For now, returning mock data structure
    const analytics = {
      timeRange,
      totalUsers: 12543,
      totalVotes: 45231,
      activeProposals: 127,
      avgParticipation: 73.2,
      // Add more analytics data as needed
    };

    return NextResponse.json(analytics);
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
