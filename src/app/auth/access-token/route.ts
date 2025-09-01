import { getAccessToken } from "@auth0/nextjs-auth0";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    // Convert the incoming Request to a full URL
    const url = new URL(req.url); // This fixes the Invalid URL error

    const { accessToken } = await getAccessToken({
      req,
      // v4 expects req + url (for cookies, headers, etc.)
      url: url.toString(),
    });

    if (!accessToken) {
      return NextResponse.json(
        { error: "No access token available" },
        { status: 401 }
      );
    }

    return NextResponse.json({ access_token: accessToken });
  } catch (error) {
    console.error("Access token error:", error);
    return NextResponse.json(
      { error: "Failed to get access token" },
      { status: 500 }
    );
  }
}
