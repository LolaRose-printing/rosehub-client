import { getAccessToken } from "@auth0/nextjs-auth0/edge";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { accessToken } = await getAccessToken(req, new Headers(req.headers));

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
