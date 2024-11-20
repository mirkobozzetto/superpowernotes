export { auth as middleware } from "@src/lib/auth/auth";

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|\\.svg|\\.png|\\.jpg|public).*)"],
};
