import { MAX_TRIAL_COUNT, RATE_LIMIT_WINDOW } from "@src/constants/demoConstants";
import { logger } from "@src/lib/logger";
import { audioService } from "@src/services/routes/audioService";
import { openAIService } from "@src/services/routes/openAIService";
import {
  DemoTranscribeRequestSchema,
  DemoTranscribeResponseSchema,
} from "@src/validations/routes/demoTranscribeRoute";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const ipRequestCounts = new Map<string, { count: number; timestamp: number }>();

function cleanupStaleEntries() {
  const now = Date.now();
  for (const [ip, info] of ipRequestCounts) {
    if (now - info.timestamp >= RATE_LIMIT_WINDOW) {
      ipRequestCounts.delete(ip);
    }
  }
}

export async function POST(req: NextRequest) {
  const clientIp = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";

  cleanupStaleEntries();

  const now = Date.now();
  const requestInfo = ipRequestCounts.get(clientIp);
  if (requestInfo && now - requestInfo.timestamp < RATE_LIMIT_WINDOW) {
    if (requestInfo.count >= MAX_TRIAL_COUNT) {
      logger.warn("Demo rate limit exceeded", { clientIp });
      return NextResponse.json({ error: "Limite dépassée" }, { status: 429 });
    }
    requestInfo.count += 1;
  } else {
    ipRequestCounts.set(clientIp, { count: 1, timestamp: now });
  }

  try {
    const formData = await req.formData();
    const validatedData = DemoTranscribeRequestSchema.parse({
      audio: formData.get("audio"),
      duration: Number(formData.get("duration") || 0),
    });

    const transcription = await audioService.transcribeAudio(validatedData.audio);
    const [tags, title] = await Promise.all([
      openAIService.generateTags(transcription),
      openAIService.generateTitle(transcription),
    ]);

    const response = DemoTranscribeResponseSchema.parse({
      transcription,
      duration: validatedData.duration,
      tags,
      fileName: title,
    });

    logger.info("Demo transcription successful", {
      clientIp,
      duration: validatedData.duration,
    });

    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn("Demo transcription validation failed", {
        clientIp,
        errors: error.errors,
      });
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    logger.error("Error in demo transcription", {
      clientIp,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return NextResponse.json({ error: "Failed to transcribe audio" }, { status: 500 });
  }
}
