import { z } from "zod";

export const TranscribeRequestSchema = z.object({
  audio: z
    .unknown()
    .refine((val): val is File => val instanceof Blob || val instanceof File, "Must be an audio file"),
  duration: z.number(),
  folderId: z.string().nullable().optional(),
});

export const TranscribeResponseSchema = z.object({
  transcription: z.string(),
  tags: z.array(z.string()),
  fileName: z.string(),
  duration: z.number(),
  remainingTime: z.number(),
  folders: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        description: z.string().nullable(),
        parentId: z.string().nullable(),
      })
    )
    .optional(),
});

export type TranscribeRequest = z.infer<typeof TranscribeRequestSchema>;
export type TranscribeResponse = z.infer<typeof TranscribeResponseSchema>;
