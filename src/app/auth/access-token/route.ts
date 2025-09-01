// src/app/auth/access-token/route.ts
import { NextResponse } from "next/server";
import { getAccessToken } from "@auth0/nextjs-auth0";

export async function GET(req: Request) {
  try {
    // Wrap the Node Request in an object for Auth0
    const { accessToken } = await getAccessToken({ request: req });

    if (!accessToken) {
      return NextResponse.json({ error: "No access token available" }, { status: 401 });
    }

    return NextResponse.json({ access_token: accessToken });
  } catch (error) {
    console.error("Access token error:", error);
    return NextResponse.json({ error: "Failed to get access token" }, { status: 500 });
  }
}
