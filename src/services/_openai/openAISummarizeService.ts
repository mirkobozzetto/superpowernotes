export const summarizeTranscriptionClient = async (transcription: string): Promise<string> => {
  const response = await fetch("/api/openai/summarize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ transcription }),
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Failed to generate summary");
  }
  const data = await response.json();
  return data.summary as string;
};
