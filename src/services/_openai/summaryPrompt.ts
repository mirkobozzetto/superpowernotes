export const generateSummaryPrompt = (transcription: string) => {
  const computedMaxTokens = Math.min(750, Math.max(150, Math.floor(transcription.length / 4)));

  return {
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are a helpful assistant that summarizes text.
        First, detect the language of the provided transcription.
        Then, analyze the transcription—taking into account its writing style and context—and produce a clear, organized summary in the EXACT SAME LANGUAGE.
        Identify the intention behind the message (e.g., if it's a task, personal reflection, etc.) and contextualize the summary accordingly.
        If the transcription is in first person, maintain this perspective in the summary to allow the user to recognize it as their own thoughts.
        The summary should be structured in a way that reflects the original intention and context, using bullet points, numbered steps, or any other appropriate format.
        Highlight the main ideas, key details, and any actionable items if applicable.
        Be faithful to the content and tone of the transcription.
        Important: The summary MUST be in the same language as the input transcription, regardless of what language it is.`,
      },
      {
        role: "user",
        content: `Please summarize the following transcription, maintaining its original intention, context, and perspective:\n\n"${transcription}"`,
      },
    ],
    max_tokens: computedMaxTokens,
  };
};
