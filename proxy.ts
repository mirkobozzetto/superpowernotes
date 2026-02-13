import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PUBLIC_ROUTES = [
  "/auth/signin",
  "/auth/verify-request",
  "/api/auth",
  "/",
  "/public",
] as const;

export async function proxy(request: NextRequest) {
  const isPublicPath = PUBLIC_ROUTES.some((route) => request.nextUrl.pathname.startsWith(route));

  if (isPublicPath) {
    return NextResponse.next();
  }

  const authCookie = request.cookies.get("authjs.session-token");

  if (!authCookie) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
