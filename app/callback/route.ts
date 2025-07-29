import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = await request.nextUrl;
  return redirect(
    `${process.env.BETTER_AUTH_URL}/api/auth/oauth2/callback/verifayda?${searchParams}`
  );
}
