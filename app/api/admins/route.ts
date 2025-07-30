import { getServerSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { admins } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const _locale = searchParams.get("locale") || "am-et"; // not used now
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    // not implimented
    const search = searchParams.get("search") || "";

    const userId = session.user.id;

    // who should read the complain region, zone, woreda not implimented
    const adminList = await db.query.admins.findMany({
      where: eq(admins.isDeleted, false),
      offset: (page - 1) * limit,
      limit,
      columns: {
        permissions: false,
        isActive: false,
        deletedAt: false,
        isDeleted: false,
      },
    });

    return NextResponse.json(adminList);
  } catch (error) {
    console.error("Error fetching admins:", error);
    return NextResponse.json(
      { error: "Failed to fetch feedback" },
      { status: 500 }
    );
  }
}
