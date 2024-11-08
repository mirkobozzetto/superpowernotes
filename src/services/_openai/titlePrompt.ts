export const generateTitlePrompt = (transcription: string) => ({
  model: "gpt-4o-mini",
  messages: [
    {
      role: "system",
      content: `You are a helpful assistant that generates titles.
        First, detect the language of the provided transcription.
        Then, generate a concise title (3-5 words) in that EXACT SAME LANGUAGE.
        The title should be clear and descriptive.
        Important: The title MUST be in the same language as the input transcription, regardless of what language it is.`,
    },
    {
      role: "user",
      content: `Generate a title for this transcription: "${transcription}"`,
    },
  ],
  max_tokens: 250,
});
