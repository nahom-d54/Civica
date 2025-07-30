import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { feedback } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { auth, getServerSession } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, message, category, priority, region, woreda } =
      await request.json();

    const [feedbackData] = await db
      .insert(feedback)
      .values({
        userId: session.user.id,
        title,
        message,
        category,
        priority,
        region,
        woreda,
        status: "pending",
      })
      .returning();

    return NextResponse.json({ success: true, feedback: feedbackData });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return NextResponse.json(
      { error: "Failed to submit feedback" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const _locale = searchParams.get("locale") || "am-et"; // not used now
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  const userId = session.user.id;

  try {
    const feedbackList = await db.query.feedback.findMany({
      where: eq(feedback.userId, userId),
      orderBy: [desc(feedback.submittedAt)],
      offset: (page - 1) * limit,
      limit,
    });

    return NextResponse.json(feedbackList);
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return NextResponse.json(
      { error: "Failed to fetch feedback" },
      { status: 500 }
    );
  }
}
