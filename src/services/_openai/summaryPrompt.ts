export const generateSummaryPrompt = (transcription: string) => {
  const computedMaxTokens = Math.min(750, Math.max(150, Math.floor(transcription.length / 4)));

  return {
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are a helpful assistant that summarizes text.
        First, detect the language of the provided transcription.
        Then, analyze the transcription and produce a clear, organized summary in the EXACT SAME LANGUAGE.
        Begin with a brief description of the content without explicitly stating it's a text or transcription.
        Then, identify the intention behind the message and continue with the main points.
        Maintain the original perspective (e.g., first person if applicable) and context.
        Structure the summary appropriately (e.g., bullet points, numbered steps) to reflect the original intention and content.
        Highlight main ideas, key details, and any actionable items if applicable.
        Be faithful to the content and tone of the transcription.
        Do not include unnecessary titles like "Résumé de la transcription".
        The summary MUST be in the same language as the input transcription.`,
      },
      {
        role: "user",
        content: `Please summarize the following, starting with a brief description of its content, then its intention, and continuing with the main points:\n\n"${transcription}"`,
      },
    ],
    max_tokens: computedMaxTokens,
  };
};
