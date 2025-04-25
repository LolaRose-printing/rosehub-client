import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { verify } from "./lib/fetcher";

export async function middleware(
  request: NextRequest,
): Promise<NextResponse<unknown> | undefined> {
  const isValid = await verify();
  const tokenId = request.cookies.get("auth")?.value;
  const expiration = request.cookies.get("expiration")?.value;
  const now = Date.now();

  if (!tokenId || !expiration || now >= +expiration || isValid.status !== 200) {
    const response = NextResponse.redirect(new URL("/auth", request.url));
    response.cookies.delete("auth");
    response.cookies.delete("expiration");

    return response;
  }
}

export const config = {
  matcher: ["/((?!auth|_next/static|_next/image|.*\\.png$|favicon.ico|sitemap.xml|robots.txt).*)"],
}
