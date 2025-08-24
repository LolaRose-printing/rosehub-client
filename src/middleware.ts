import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow auth page and API routes
  if (pathname.startsWith('/auth') || pathname.startsWith('/api/') || pathname.startsWith('/_next/')) {
    return NextResponse.next();
  }
  
  // Check for auth cookie
  const authCookie = request.cookies.get('auth_user');
  
  // If no auth cookie and not on auth page, redirect to auth
  if (!authCookie && pathname !== '/auth') {
    return NextResponse.redirect(new URL('/auth', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/auth|auth|_next/static|_next/image|.*\\.png$|favicon.ico|sitemap.xml|robots.txt).*)"],
}
