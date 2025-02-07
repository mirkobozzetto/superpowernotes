import { openAIService } from "@src/services/routes/openAIService";
import { NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
  transcription: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { transcription } = bodySchema.parse(body);
    const summary = await openAIService.summarizeTranscription(transcription);
    return NextResponse.json({ summary });
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate summary" }, { status: 500 });
  }
}
