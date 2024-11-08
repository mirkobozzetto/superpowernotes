import { z } from "zod";
import { MAX_TAGS, MIN_TAGS } from "./tagsPrompt";

export const OpenAIMessageSchema = z.object({
  role: z.enum(["system", "user"]),
  content: z.string(),
});

export const OpenAIPromptSchema = z.object({
  model: z.literal("gpt-4o-mini"),
  messages: z.array(OpenAIMessageSchema),
  max_tokens: z.number().positive(),
});

export const TranscriptionSchema = z
  .string()
  .min(1, "Transcription cannot be empty")
  .max(4000, "Transcription too long");

export const OpenAIResponseSchema = z.object({
  choices: z
    .array(
      z.object({
        message: z.object({
          content: z.string(),
        }),
      })
    )
    .min(1),
});

export const TagSchema = z
  .string()
  .min(1)
  .regex(/^[\w\u00C0-\u017F]+$/, "Tag must be a single word")
  .transform((val) => val.toLowerCase());

export const TagsResponseSchema = z
  .array(TagSchema)
  .min(MIN_TAGS, `Minimum ${MIN_TAGS} tag required`)
  .max(MAX_TAGS, `Maximum ${MAX_TAGS} tags allowed`);

export const TitleResponseSchema = z
  .string()
  .min(1, "Title cannot be empty")
  .max(100, "Title too long")
  .refine(
    (title) => title.split(" ").length >= 3 && title.split(" ").length <= 5,
    "Title must be between 3 and 5 words"
  );

export type OpenAIPrompt = z.infer<typeof OpenAIPromptSchema>;
export type OpenAIResponse = z.infer<typeof OpenAIResponseSchema>;
