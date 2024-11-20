import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

export const authConfig = {
  providers: [Google],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAuthPage = nextUrl.pathname.startsWith("/auth");
      const isPublicPage = ["/", "/auth/verify-request"].includes(nextUrl.pathname);
      const isApiRoute = nextUrl.pathname.startsWith("/api");

      const isStaticAsset =
        nextUrl.pathname.startsWith("/_next") ||
        nextUrl.pathname.includes("/public/") ||
        nextUrl.pathname.endsWith(".svg") ||
        nextUrl.pathname.endsWith(".ico") ||
        nextUrl.pathname.endsWith(".png") ||
        nextUrl.pathname.endsWith(".jpg") ||
        nextUrl.pathname.endsWith(".jpeg") ||
        nextUrl.pathname.endsWith(".gif") ||
        nextUrl.pathname.endsWith(".webp") ||
        nextUrl.pathname.endsWith(".mp4") ||
        nextUrl.pathname.includes("/images/");

      if (isStaticAsset) return true;
      if (isAuthPage) return true;
      if (isPublicPage) return true;
      if (isApiRoute) return isLoggedIn;

      return isLoggedIn;
    },
  },
} satisfies NextAuthConfig;
