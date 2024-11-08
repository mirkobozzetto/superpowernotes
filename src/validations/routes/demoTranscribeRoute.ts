import { MAX_DEMO_DURATION } from "@src/constants/demoConstants";
import { z } from "zod";

export const DemoTranscribeRequestSchema = z.object({
  audio: z.instanceof(File, { message: "No audio file provided" }),
  duration: z
    .number()
    .min(0)
    .max(MAX_DEMO_DURATION, `Duration cannot exceed ${MAX_DEMO_DURATION} seconds`),
});

export const DemoTranscribeResponseSchema = z.object({
  transcription: z.string(),
  duration: z.number(),
  tags: z.array(z.string()),
  fileName: z.string(),
});

export type DemoTranscribeRequest = z.infer<typeof DemoTranscribeRequestSchema>;
export type DemoTranscribeResponse = z.infer<typeof DemoTranscribeResponseSchema>;
