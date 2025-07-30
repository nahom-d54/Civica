import { type NextRequest, NextResponse } from "next/server";
import { auth, getServerSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { feedback, admins } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;

    // Check if user is admin
    const adminRole = await db.query.admins.findFirst({
      where: eq(admins.userId, session.user.id),
    });

    if (!adminRole) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { status } = await request.json();

    await db.update(feedback).set({ status }).where(eq(feedback.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating feedback status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
