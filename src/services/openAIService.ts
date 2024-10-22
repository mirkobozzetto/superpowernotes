const MIN_TAGS = 1;
const MAX_TAGS = 4;

export const openAIService = {
  async generateTags(transcription: string): Promise<string[]> {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
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
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.choices?.[0]?.message?.content) {
        throw new Error("Unexpected response structure from OpenAI API");
      }

      const rawTags = data.choices[0].message.content
        .split(",")
        .map((tag: string) => tag.trim().toLowerCase())
        .filter((tag: string) => tag.split(" ").length === 1);

      const uniqueTags = Array.from(new Set(rawTags)).filter(
        (tag): tag is string => typeof tag === "string"
      );

      return uniqueTags.slice(0, MAX_TAGS);
    } catch (error) {
      console.error("Error generating tags:", error);
      return [];
    }
  },

  async generateTitle(transcription: string): Promise<string> {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
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
          max_tokens: 50,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content.trim() || "Note sans titre";
    } catch (error) {
      console.error("Error generating title:", error);
      return "Note sans titre";
    }
  },
};
