import { z } from "zod";

export const UserUsageResponseSchema = z.object({
  timeLimit: z.number(),
  currentPeriodUsedTime: z.number(),
  currentPeriodRemainingTime: z.number(),
  lastResetDate: z.date(),
});

export type UserUsageResponse = z.infer<typeof UserUsageResponseSchema>;
