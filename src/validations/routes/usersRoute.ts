import { z } from "zod";

export const UserResponseSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  email: z.string().email(),
  role: z.enum(["USER", "ADMIN", "BETA"]),
  timeLimit: z.number(),
  currentPeriodUsedTime: z.number(),
  currentPeriodRemainingTime: z.number(),
  lastResetDate: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
  emailVerified: z.date().nullable(),
  notesCount: z.number(),
});

export type UserResponse = z.infer<typeof UserResponseSchema>;
