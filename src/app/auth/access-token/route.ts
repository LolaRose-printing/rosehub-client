import { getAccessToken } from "@auth0/nextjs-auth0";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    // Use APP_BASE_URL from environment as the base for relative URLs
    const baseUrl = process.env.APP_BASE_URL!;
    const url = new URL(req.url, baseUrl);

    const { accessToken } = await getAccessToken({
      req,
      url: url.toString(), // absolute URL required by v4
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
