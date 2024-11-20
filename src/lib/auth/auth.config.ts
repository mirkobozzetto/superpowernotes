import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

export const authConfig = {
  providers: [Google],
  session: {
    strategy: "database",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAuthPage = nextUrl.pathname.startsWith("/auth");
      const isPublicPage = ["/", "/auth/verify-request"].includes(nextUrl.pathname);
      const isApiRoute = nextUrl.pathname.startsWith("/api");

      if (isAuthPage) return true;
      if (isPublicPage) return true;
      if (isApiRoute) return isLoggedIn;

      return isLoggedIn;
    },
  },
} satisfies NextAuthConfig;
