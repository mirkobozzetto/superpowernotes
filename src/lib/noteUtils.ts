const MIN_TAGS = 1;
const MAX_TAGS = 4;

export async function generateTags(transcription: string): Promise<string[]> {
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
            content: `You are a helpful assistant that generates relevant tags for a given text.
               Please provide between ${MIN_TAGS} and ${MAX_TAGS} tags, each tag being a single word, separated by commas.`,
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
    if (
      !data.choices ||
      !data.choices[0] ||
      !data.choices[0].message ||
      !data.choices[0].message.content
    ) {
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
}

// export async function generateTitle(transcription: string): Promise<string> {
//   try {
//     const response = await fetch("https://api.openai.com/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         model: "gpt-4o-mini",
//         messages: [
//           {
//             role: "system",
//             content:
//               "You are a helpful assistant that generates concise and relevant titles for given text. Please provide a title of no more than 5 words.",
//           },
//           {
//             role: "user",
//             content: `Generate a title for the following transcription: "${transcription}"`,
//           },
//         ],
//         max_tokens: 20,
//       }),
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const data = await response.json();
//     if (
//       !data.choices ||
//       !data.choices[0] ||
//       !data.choices[0].message ||
//       !data.choices[0].message.content
//     ) {
//       throw new Error("Unexpected response structure from OpenAI API");
//     }

//     return data.choices[0].message.content.trim();
//   } catch (error) {
//     console.error("Error generating title:", error);
//     return "Untitled Note";
//   }
// }

export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `VoiceNote-${year}-${month}-${day}`;
}
