import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token");

  const pathname = request.nextUrl.pathname;

  const isAuthPage = pathname === "/login" || pathname === "/signup";

  const isProtectedRoute = pathname.startsWith("/leads");

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/leads", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/leads/:path*", "/login", "/signup"],
};
