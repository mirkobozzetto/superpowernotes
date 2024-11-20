import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { type DefaultSession } from "next-auth";
import Resend from "next-auth/providers/resend";
import { prisma } from "../prisma";
import { authConfig } from "./auth.config";
import { sendVerificationRequest } from "./email";

declare module "next-auth" {
  interface User {
    role?: "ADMIN" | "USER" | "BETA";
  }
  interface Session extends DefaultSession {
    user?: User;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers: [
    ...authConfig.providers,
    Resend({
      apiKey: process.env.AUTH_RESEND_KEY,
      from: process.env.EMAIL_FROM || "",
      sendVerificationRequest: async (params) => {
        const { identifier, url, provider } = params;
        await sendVerificationRequest({
          identifier,
          url,
          provider: {
            ...provider,
            from: provider.from || "",
          },
        });
      },
    }),
  ],
  pages: {
    verifyRequest: "/auth/verify-request",
  },
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
          });

          if (!existingUser) {
            await prisma.user.create({
              data: {
                email: user.email,
                name: user.name,
                image: user.image,
                emailVerified: new Date(),
                role: "BETA",
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            });
          } else {
            await prisma.user.update({
              where: { email: user.email },
              data: {
                emailVerified: new Date(),
                name: user.name,
                image: user.image,
              },
            });
          }

          const userForAccount =
            existingUser || (await prisma.user.findUnique({ where: { email: user.email } }));
          if (userForAccount) {
            await prisma.account.upsert({
              where: {
                provider_providerAccountId: {
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                },
              },
              create: {
                userId: userForAccount.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                refresh_token: account.refresh_token,
                access_token: account.access_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
              },
              update: {
                refresh_token: account.refresh_token,
                access_token: account.access_token,
                expires_at: account.expires_at,
              },
            });
          }

          return true;
        } catch (error) {
          console.error("Error creating/updating user or account:", error);
          return false;
        }
      }
      return true;
    },
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.emailVerified = user.emailVerified;
        session.user.role = user.role as "ADMIN" | "USER" | "BETA";
      }
      return session;
    },
  },
});
