import { auth } from "@src/lib/auth/auth";

export default auth;

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.well-known).*)"],
};
