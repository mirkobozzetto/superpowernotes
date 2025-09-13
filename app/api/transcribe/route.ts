import type { Folder } from "@prisma/client";
import { auth } from "@src/lib/auth/auth";
import { logger } from "@src/lib/logger";
import { prisma } from "@src/lib/prisma";
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
  const userId = session?.user?.id;

  if (!userId) {
    logger.warn("Unauthorized transcription attempt");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let foundFolder: Folder | null = null;

  try {
    const user = await transcribeQueryBuilder.getUserTimeInfo(userId);
    const formData = await req.formData();

    const validatedData = TranscribeRequestSchema.parse({
      audio: formData.get("audio"),
      duration: Number(formData.get("duration") || 0),
      folderId: formData.get("folderId") || null,
    });

    if (user.currentPeriodRemainingTime < validatedData.duration) {
      logger.warn("Time limit exceeded", {
        userId,
        requestedDuration: validatedData.duration,
        remainingTime: user.currentPeriodRemainingTime,
      });
      return NextResponse.json({ error: "Time limit exceeded" }, { status: 403 });
    }

    if (validatedData.folderId) {
      foundFolder = await prisma.folder.findFirst({
        where: {
          id: validatedData.folderId,
          userId,
        },
      });

      if (!foundFolder) {
        logger.warn("Invalid folder access attempt", {
          userId,
          folderId: validatedData.folderId,
        });
        return NextResponse.json({ error: "Invalid folder" }, { status: 404 });
      }
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
      tags,
      validatedData.folderId
    );

    const response = TranscribeResponseSchema.parse({
      transcription: result.voiceNote.transcription,
      tags: result.voiceNote.tags,
      fileName: result.voiceNote.fileName,
      duration: validatedData.duration,
      remainingTime: result.remainingTime,
      folders:
        validatedData.folderId && foundFolder
          ? [
              {
                id: foundFolder.id,
                name: foundFolder.name,
                description: foundFolder.description,
                parentId: foundFolder.parentId,
              },
            ]
          : undefined,
    });

    logger.info("Transcription successful", {
      userId,
      duration: validatedData.duration,
      remainingTime: result.remainingTime,
      transcriptionLength: transcription.length,
      folderId: validatedData.folderId,
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
