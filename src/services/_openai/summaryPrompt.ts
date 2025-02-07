export const generateSummaryPrompt = (transcription: string) => ({
  model: "gpt-4o-mini",
  messages: [
    {
      role: "system",
      content: `You are a helpful assistant that summarizes text. Detect the language of the transcription and produce a concise summary capturing the main ideas in the same language.`,
    },
    {
      role: "user",
      content: `Summarize the following transcription: "${transcription}"`,
    },
  ],
  max_tokens: 150,
});
