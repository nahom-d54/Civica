import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { feedback } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

export const GET = async (
  _request: NextRequest,
  param: { params: Promise<{ id: string }> }
) => {
  const { id } = await param.params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const feedbackList = await db.query.feedback.findFirst({
      where: eq(feedback.id, id),
      with: {
        user: true,
      },
    });

    return NextResponse.json(feedbackList);
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return NextResponse.json(
      { error: "Failed to fetch feedback" },
      { status: 500 }
    );
  }
};
