import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { type DefaultSession } from "next-auth";
import { prisma } from "../prisma";
import { authConfig } from "./auth.config";

declare module "next-auth" {
  interface User {
    role?: "ADMIN" | "USER" | "BETA";
    emailVerified?: Date;
  }
  interface Session extends DefaultSession {
    user?: User;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
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
  },
});
