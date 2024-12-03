import { z } from "zod";

export const SaveVoiceNoteInputSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  transcription: z.string().min(1, "Transcription is required"),
  duration: z.number().positive("Duration must be positive"),
  title: z.string().min(1, "Title is required"),
  tags: z.array(z.string()),
  folderId: z.string().nullable().optional(),
});

export const VoiceNoteResponseSchema = z.object({
  voiceNote: z.object({
    id: z.string(),
    transcription: z.string(),
    fileName: z.string(),
    tags: z.array(z.string()),
    duration: z.number(),
    userId: z.string(),
  }),
  remainingTime: z.number(),
});

export type SaveVoiceNoteInput = z.infer<typeof SaveVoiceNoteInputSchema>;
export type VoiceNoteResponse = z.infer<typeof VoiceNoteResponseSchema>;
