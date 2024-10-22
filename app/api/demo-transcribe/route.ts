import {
  MAX_DEMO_DURATION,
  MAX_TRIAL_COUNT,
  RATE_LIMIT_WINDOW,
} from "@src/constants/demoConstants";
import { audioService } from "@src/services/audioService";
import { openAIService } from "@src/services/openAIService";
import { NextRequest, NextResponse } from "next/server";

const ipRequestCounts = new Map<string, { count: number; timestamp: number }>();

export async function POST(req: NextRequest) {
  const clientIp = req.ip || "unknown";

  const now = Date.now();
  const requestInfo = ipRequestCounts.get(clientIp);
  if (requestInfo && now - requestInfo.timestamp < RATE_LIMIT_WINDOW) {
    if (requestInfo.count >= MAX_TRIAL_COUNT) {
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
    const transcription = await audioService.transcribeAudio(audioFile);
    const [tags, title] = await Promise.all([
      openAIService.generateTags(transcription),
      openAIService.generateTitle(transcription),
    ]);

    return NextResponse.json({
      transcription,
      duration,
      tags,
      fileName: title,
    });
  } catch (error) {
    console.error("Error in demo transcription:", error);
    return NextResponse.json({ error: "Failed to transcribe audio" }, { status: 500 });
  }
}
