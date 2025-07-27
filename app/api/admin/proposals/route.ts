import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { proposals } from "@/lib/db/schema"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, description, category, regionScope, targetRegion, startsAt, endsAt } = await request.json()

    await db.insert(proposals).values({
      title,
      description,
      category,
      regionScope,
      targetRegion,
      startsAt: new Date(startsAt),
      endsAt: new Date(endsAt),
      createdBy: session.user.id,
      isActive: true,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error creating proposal:", error)
    return NextResponse.json({ error: "Failed to create proposal" }, { status: 500 })
  }
}
