import { logger } from "@src/lib/logger";
import { OpenAIServiceError } from "../_openai/openAIError";
import { generateTagsPrompt } from "../_openai/tagsPrompt";
import { generateTitlePrompt } from "../_openai/titlePrompt";
import {
  OpenAIPromptSchema,
  OpenAIResponseSchema,
  TagsResponseSchema,
  TitleResponseSchema,
  TranscriptionSchema,
} from "../_openai/validation";

const makeOpenAIRequest = async (prompt: unknown) => {
  const validatedPrompt = OpenAIPromptSchema.parse(prompt);

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(validatedPrompt),
  });

  if (!response.ok) {
    throw new OpenAIServiceError(`HTTP error! status: ${response.status}`, "API_ERROR");
  }

  const data = await response.json();
  return OpenAIResponseSchema.parse(data);
};

export const openAIService = {
  async generateTags(transcription: string): Promise<string[]> {
    try {
      const validatedTranscription = TranscriptionSchema.parse(transcription);

      const data = await makeOpenAIRequest(generateTagsPrompt(validatedTranscription));

      const rawTags = data.choices[0].message.content
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

      const validatedTags = TagsResponseSchema.parse(rawTags);

      logger.info("Tags generated successfully", {
        transcriptionLength: validatedTranscription.length,
        tagCount: validatedTags.length,
      });

      return validatedTags;
    } catch (error) {
      logger.error("Error generating tags", {
        error: error instanceof Error ? error.message : "Unknown error",
      });

      return TagsResponseSchema.parse([]);
    }
  },

  async generateTitle(transcription: string): Promise<string> {
    try {
      const validatedTranscription = TranscriptionSchema.parse(transcription);
      const data = await makeOpenAIRequest(generateTitlePrompt(validatedTranscription));
      const validatedTitle = TitleResponseSchema.parse(data.choices[0].message.content.trim());

      logger.info("Title generated successfully", {
        transcriptionLength: validatedTranscription.length,
        titleLength: validatedTitle.length,
      });

      return validatedTitle;
    } catch (error) {
      logger.error("Error generating title", {
        error: error instanceof Error ? error.message : "Unknown error",
      });
      return "Note sans titre";
    }
  },
};
