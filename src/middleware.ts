import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(
  request: NextRequest,
): NextResponse<unknown> | undefined {
  const tokenId = request.cookies.get("auth")?.value;
  const expiration = request.cookies.get("expiration")?.value;
  const now = Date.now();

  if (!tokenId || !expiration || now >= +expiration) {
    const response = NextResponse.redirect(new URL("/auth", request.url));
    response.cookies.delete("auth");
    response.cookies.delete("expiration");

    return response;
  }
}

export const config = {
  matcher: ["/((?!auth|_next/static|_next/image|.*\\.png$|favicon.ico|sitemap.xml|robots.txt).*)"],
}
