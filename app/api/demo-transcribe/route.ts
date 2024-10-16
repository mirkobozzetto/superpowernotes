import { generateTags } from "@src/lib/noteUtils";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MAX_DEMO_DURATION = 30;
const DEMO_RATE_LIMIT = 5;
const RATE_LIMIT_WINDOW = 5 * 60 * 1000;

const ipRequestCounts = new Map<string, { count: number; timestamp: number }>();

export async function POST(req: NextRequest) {
  const clientIp = req.ip || "unknown";

  const now = Date.now();
  const requestInfo = ipRequestCounts.get(clientIp);
  if (requestInfo && now - requestInfo.timestamp < RATE_LIMIT_WINDOW) {
    if (requestInfo.count >= DEMO_RATE_LIMIT) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }
    requestInfo.count += 1;
  } else {
    ipRequestCounts.set(clientIp, { count: 1, timestamp: now });
  }

  const formData = await req.formData();
  const audioFile = formData.get("audio") as File;
  const duration = Number(formData.get("duration") || 0);

  if (!audioFile) {
    return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
  }

  if (duration > MAX_DEMO_DURATION) {
    return NextResponse.json({ error: "Demo duration exceeded" }, { status: 400 });
  }

  try {
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
    });

    const tags = await generateTags(transcription.text);
    //await fetch ?? => generateTags || generateTitle etc ...
    return NextResponse.json({
      transcription: transcription.text,
      duration: duration,
      tags: tags,
    });
  } catch (error) {
    console.error("Error in demo transcription:", error);
    return NextResponse.json({ error: "Failed to transcribe audio" }, { status: 500 });
  }
}
