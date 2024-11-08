import { UserRole } from "@prisma/client";
import { z } from "zod";

export const UserUpdateSchema = z.object({
  role: z.nativeEnum(UserRole).optional(),
  timeLimit: z.union([z.string().transform((val) => parseInt(val, 10)), z.number()]).optional(),
  currentPeriodRemainingTime: z.number().optional(),
  currentPeriodUsedTime: z.number().optional(),
  lastResetDate: z.union([z.string().transform((val) => new Date(val)), z.date()]).optional(),
});

export type UserUpdate = z.infer<typeof UserUpdateSchema>;
