import { auth } from "@src/lib/auth/auth";
import { logger } from "@src/lib/logger";
import { audioService } from "@src/services/routes/audioService";
import { openAIService } from "@src/services/routes/openAIService";
import { transcribeQueryBuilder } from "@src/services/routes/transcribeQueryBuilder";
import {
  TranscribeRequestSchema,
  TranscribeResponseSchema,
} from "@src/validations/routes/transcribeRoute";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    logger.warn("Unauthorized transcription attempt");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const user = await transcribeQueryBuilder.getUserTimeInfo(userId);
    const formData = await req.formData();

    const validatedData = TranscribeRequestSchema.parse({
      audio: formData.get("audio"),
      duration: Number(formData.get("duration") || 0),
    });

    if (user.currentPeriodRemainingTime < validatedData.duration) {
      logger.warn("Time limit exceeded", {
        userId,
        requestedDuration: validatedData.duration,
        remainingTime: user.currentPeriodRemainingTime,
      });
      return NextResponse.json({ error: "Time limit exceeded" }, { status: 403 });
    }

    const transcription = await audioService.transcribeAudio(validatedData.audio);
    const [tags, fileName] = await Promise.all([
      openAIService.generateTags(transcription),
      openAIService.generateTitle(transcription),
    ]);

    const result = await audioService.saveVoiceNote(
      userId,
      transcription,
      validatedData.duration,
      fileName,
      tags
    );

    const response = TranscribeResponseSchema.parse({
      transcription: result.voiceNote.transcription,
      tags: result.voiceNote.tags,
      fileName: result.voiceNote.fileName,
      duration: validatedData.duration,
      remainingTime: result.remainingTime,
    });

    logger.info("Transcription successful", {
      userId,
      duration: validatedData.duration,
      remainingTime: result.remainingTime,
      transcriptionLength: transcription.length,
    });

    return NextResponse.json(response);
  } catch (error) {
    logger.error("Transcription failed", {
      userId,
      error: error instanceof Error ? error.message : "Unknown error",
    });

    if (error instanceof Error && error.message === "User not found") {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ error: "Failed to transcribe audio" }, { status: 500 });
  }
}
