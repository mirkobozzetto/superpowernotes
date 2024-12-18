import { WHISPER_SUPPORTED_FORMATS } from "@src/constants/audioConstants";
import { logger } from "@src/lib/logger";
import { SaveVoiceNoteInputSchema, VoiceNoteResponseSchema } from "@src/validations/audioService";
import OpenAI from "openai";
import { prisma } from "../../lib/prisma";
import { AudioConversionError, audioConversionService } from "../audioConversion";

export type WhisperFormat = (typeof WHISPER_SUPPORTED_FORMATS)[number];

export class AudioServiceError extends Error {
  constructor(
    message: string,
    public code: string
  ) {
    super(message);
    this.name = "AudioServiceError";
  }
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const audioService = {
  async transcribeAudio(audioFile: File): Promise<string> {
    try {
      logger.info("Starting transcription process", {
        fileType: audioFile.type,
        fileSize: audioFile.size,
        name: audioFile.name,
        userAgent: typeof window !== "undefined" ? window.navigator.userAgent : "unknown",
      });

      let fileToTranscribe = audioFile;

      if (!WHISPER_SUPPORTED_FORMATS.includes(audioFile.type as WhisperFormat)) {
        logger.warn("Converting audio format", {
          originalFormat: audioFile.type,
          originalSize: audioFile.size,
          supportedFormats: WHISPER_SUPPORTED_FORMATS,
        });
        fileToTranscribe = await audioConversionService.convertToCompatibleFormat(audioFile);
        logger.info("Conversion completed", {
          newFormat: fileToTranscribe.type,
          newSize: fileToTranscribe.size,
        });
      }

      const transcription = await openai.audio.transcriptions.create({
        file: fileToTranscribe,
        model: "whisper-1",
      });

      logger.info("Transcription successful", {
        inputFormat: fileToTranscribe.type,
        inputSize: fileToTranscribe.size,
        transcriptionLength: transcription.text.length,
        converted: fileToTranscribe !== audioFile,
      });

      return transcription.text;
    } catch (error) {
      if (error instanceof AudioConversionError) {
        throw new AudioServiceError(error.message, error.code);
      }

      logger.error("Transcription failed", {
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        fileType: audioFile.type,
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
