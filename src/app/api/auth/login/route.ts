// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";

// Helper function to generate state/nonce
function generateRandomString(length: number): string {
  const array = new Uint8Array(length);
  if (typeof crypto !== "undefined") {
    crypto.getRandomValues(array);
  } else {
    // fallback for Node.js environment
    for (let i = 0; i < length; i++) array[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function GET(request: NextRequest) {
  try {
    // Server-side environment variables
    const domain = process.env.AUTH0_DOMAIN;
    const clientId = process.env.AUTH0_CLIENT_ID;
    const audience = process.env.AUTH0_AUDIENCE;
    const baseUrl = process.env.APP_BASE_URL;

    console.log("AUTH0_DOMAIN:", domain);
    console.log("AUTH0_CLIENT_ID:", clientId);
    console.log("APP_BASE_URL:", baseUrl);

    if (!domain || !clientId || !baseUrl) {
      throw new Error("Auth0 configuration missing");
    }

    // Ensure the domain has https:// prefix
    const auth0Base = domain.startsWith("http") ? domain : `https://${domain}`;

    const state = generateRandomString(32);
    const nonce = generateRandomString(32);

    const loginUrl =
      `${auth0Base}/authorize?` +
      new URLSearchParams({
        response_type: "code",
        client_id: clientId,
        redirect_uri: `${baseUrl}/api/auth/callback`,
        scope: process.env.AUTH0_SCOPE || "openid profile email",
        audience: audience || "",
        state,
        nonce,
      }).toString();

    console.log("Redirecting to Auth0 login:", loginUrl);

    return NextResponse.redirect(loginUrl);
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
