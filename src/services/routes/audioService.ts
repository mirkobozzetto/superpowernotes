import { logger } from "@src/lib/logger";
import { SaveVoiceNoteInputSchema, VoiceNoteResponseSchema } from "@src/validations/audioService";
import OpenAI from "openai";
import { prisma } from "../../lib/prisma";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class AudioServiceError extends Error {
  constructor(
    message: string,
    public code: string
  ) {
    super(message);
    this.name = "AudioServiceError";
  }
}

export const audioService = {
  async transcribeAudio(audioFile: File): Promise<string> {
    try {
      const transcription = await openai.audio.transcriptions.create({
        file: audioFile,
        model: "whisper-1",
      });

      logger.info("Audio transcription successful", {
        fileSize: audioFile.size,
        transcriptionLength: transcription.text.length,
      });

      return transcription.text;
    } catch (error) {
      logger.error("Transcription failed", {
        error: error instanceof Error ? error.message : "Unknown error",
        fileSize: audioFile.size,
      });
      throw new AudioServiceError("Failed to transcribe audio", "TRANSCRIPTION_FAILED");
    }
  },

  async saveVoiceNote(
    userId: string,
    transcription: string,
    duration: number,
    title: string,
    tags: string[],
    folderId?: string | null
  ) {
    try {
      const validatedInput = SaveVoiceNoteInputSchema.parse({
        userId,
        transcription,
        duration,
        title,
        tags,
        folderId,
      });

      const user = await prisma.user.findUnique({
        where: { id: validatedInput.userId },
        select: {
          timeLimit: true,
          currentPeriodUsedTime: true,
          currentPeriodRemainingTime: true,
        },
      });

      if (!user) {
        throw new AudioServiceError("User not found", "USER_NOT_FOUND");
      }

      if (user.currentPeriodRemainingTime < validatedInput.duration) {
        throw new AudioServiceError("Time limit exceeded", "TIME_LIMIT_EXCEEDED");
      }

      const createData = {
        transcription: validatedInput.transcription,
        fileName: validatedInput.title,
        tags: validatedInput.tags,
        duration: validatedInput.duration,
        userId: validatedInput.userId,
      };

      if (validatedInput.folderId) {
        const folder = await prisma.folder.findUnique({
          where: {
            id: validatedInput.folderId,
            userId: validatedInput.userId,
          },
        });

        if (!folder) {
          throw new AudioServiceError("Invalid folder", "FOLDER_NOT_FOUND");
        }
      }

      const [voiceNote, updatedUser] = await prisma.$transaction([
        prisma.voiceNote.create({
          data: {
            ...createData,
            folders: validatedInput.folderId
              ? {
                  create: [
                    {
                      folder: {
                        connect: {
                          id: validatedInput.folderId,
                        },
                      },
                    },
                  ],
                }
              : undefined,
          },
          include: {
            folders: {
              include: {
                folder: true,
              },
            },
          },
        }),
        prisma.user.update({
          where: { id: validatedInput.userId },
          data: {
            currentPeriodUsedTime: { increment: validatedInput.duration },
            currentPeriodRemainingTime: { decrement: validatedInput.duration },
          },
        }),
      ]);

      const response = VoiceNoteResponseSchema.parse({
        voiceNote,
        remainingTime: updatedUser.currentPeriodRemainingTime,
      });

      logger.info("Voice note saved successfully", {
        userId: validatedInput.userId,
        voiceNoteId: voiceNote.id,
        duration: validatedInput.duration,
        folderId: validatedInput.folderId,
      });

      return response;
    } catch (error) {
      logger.error("Failed to save voice note", {
        userId,
        error: error instanceof Error ? error.message : "Unknown error",
      });

      if (error instanceof AudioServiceError) {
        throw error;
      }

      throw new AudioServiceError("Failed to save voice note", "SAVE_FAILED");
    }
  },
};
