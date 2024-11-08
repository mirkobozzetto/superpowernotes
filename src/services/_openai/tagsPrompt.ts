export const MIN_TAGS = 1;
export const MAX_TAGS = 4;

export const generateTagsPrompt = (transcription: string) => ({
  model: "gpt-4o-mini",
  messages: [
    {
      role: "system",
      content: `You are a helpful assistant that generates relevant tags.
        First, detect the language of the provided transcription.
        Then, generate between ${MIN_TAGS} and ${MAX_TAGS} tags in that EXACT SAME LANGUAGE.
        Each tag should be a single word, separated by commas.
        Important: Tags MUST be in the same language as the input transcription, regardless of what language it is.`,
    },
    {
      role: "user",
      content: `Generate tags for the following transcription: "${transcription}"`,
    },
  ],
  max_tokens: 50,
});
