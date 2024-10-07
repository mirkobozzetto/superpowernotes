import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { type DefaultSession } from "next-auth";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import { prisma } from "../prisma";
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
  adapter: PrismaAdapter(prisma),
  providers: [
    Google,
    Resend({
      apiKey: process.env.AUTH_RESEND_KEY,
      from: process.env.EMAIL_FROM || "",
      sendVerificationRequest: async (params) => {
        const { identifier, url, provider, theme } = params;
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
  callbacks: {
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
