import { z } from "zod";

export const RemainingTimeSchema = z.object({
  currentPeriodRemainingTime: z.number().min(0),
});

export const VoiceNoteSchema = z.object({
  id: z.string(),
  createdAt: z
    .string()
    .or(z.date())
    .transform((val) => new Date(val)),
  modifiedAt: z
    .string()
    .or(z.date())
    .nullable()
    .transform((val) => (val ? new Date(val) : null)),
  fileName: z.string().nullable(),
  transcription: z.string(),
  tags: z.array(z.string()),
  duration: z.number().nullable(),
  userId: z.string(),
});

export const LastVoiceNoteSchema = z.object({
  voiceNotes: z.array(VoiceNoteSchema),
});

export const UserDataSchema = z
  .object({
    role: z.enum(["ADMIN", "USER", "BETA"]).optional(),
    timeLimit: z.number().optional(),
    currentPeriodRemainingTime: z.number().min(0).optional(),
    currentPeriodUsedTime: z.number().min(0).optional(),
    lastResetDate: z
      .string()
      .or(z.date())
      .transform((val) => (val ? new Date(val) : undefined))
      .optional(),
  })
  .partial();
