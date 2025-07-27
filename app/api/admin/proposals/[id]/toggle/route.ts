import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { proposals } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { isActive } = await request.json();

    await db
      .update(proposals)
      .set({
        isActive,
        updatedAt: new Date(),
      })
      .where(eq(proposals.id, params.id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error toggling proposal status:", error);
    return NextResponse.json(
      { error: "Failed to toggle proposal status" },
      { status: 500 }
    );
  }
}
