import { User as PrismaUser } from "@prisma/client";

export type User = Omit<
  PrismaUser,
  "createdAt" | "updatedAt" | "lastResetDate" | "emailVerified"
> & {
  createdAt: string;
  updatedAt: string;
  lastResetDate: string;
  emailVerified: string | null;
};
