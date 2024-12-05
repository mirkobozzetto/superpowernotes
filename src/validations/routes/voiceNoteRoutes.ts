import type { VoiceNote } from "@prisma/client";
import { z } from "zod";

export const VoiceNoteSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  modifiedAt: z.date().nullable(),
  fileName: z.string().nullable(),
  transcription: z.string(),
  tags: z.array(z.string()),
  duration: z.number().nullable(),
  userId: z.string(),
});

export const SearchParamsSchema = z.object({
  tags: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  keyword: z.string(),
});

export type VoiceNoteInput = z.infer<typeof VoiceNoteSchema>;
export type SearchParamsType = z.infer<typeof SearchParamsSchema>;

export type VoiceNoteUpdateInput = Partial<Omit<VoiceNote, "id" | "createdAt" | "userId">>;
export type VoiceNoteCreateInput = Omit<VoiceNote, "id" | "createdAt" | "userId">;
