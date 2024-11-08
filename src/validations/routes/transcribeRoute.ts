import { z } from "zod";

export const TranscribeRequestSchema = z.object({
  audio: z.instanceof(File, { message: "No audio file provided" }),
  duration: z.number().min(0, "Duration must be positive"),
});

export const TranscribeResponseSchema = z.object({
  transcription: z.string(),
  tags: z.array(z.string()),
  fileName: z.string(),
  duration: z.number(),
  remainingTime: z.number(),
});

export type TranscribeRequest = z.infer<typeof TranscribeRequestSchema>;
export type TranscribeResponse = z.infer<typeof TranscribeResponseSchema>;
