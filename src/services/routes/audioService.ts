import { AUDIO_MIME_TYPES, WHISPER_SUPPORTED_FORMATS } from "@src/constants/audioConstants";
import { logger } from "@src/lib/logger";
import { SaveVoiceNoteInputSchema, VoiceNoteResponseSchema } from "@src/validations/audioService";
import OpenAI from "openai";
import { prisma } from "../../lib/prisma";

export type AudioMimeType = (typeof AUDIO_MIME_TYPES)[keyof typeof AUDIO_MIME_TYPES];
export type WhisperFormat = (typeof WHISPER_SUPPORTED_FORMATS)[number];

const CONVERSION_SERVICE_URL = process.env.CONVERSION_SERVICE_URL || "http://localhost:4000";

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
  async convertToCompatibleFormat(audioFile: File): Promise<File> {
    const arrayBuffer = await audioFile.arrayBuffer();

    const response = await fetch(`${CONVERSION_SERVICE_URL}/convert`, {
      method: "POST",
      headers: {
        "Content-Type": audioFile.type,
      },
      body: arrayBuffer,
    });

    if (!response.ok) {
      const errorData = await response.json();
      logger.error("Audio conversion failed", { error: errorData.error });
      throw new AudioServiceError(
        errorData.error || "Failed to convert audio",
        errorData.code || "CONVERSION_FAILED"
      );
    }

    const convertedBuffer = await response.arrayBuffer();
    return new File([convertedBuffer], "converted.mp3", {
      type: AUDIO_MIME_TYPES.MP3,
    });
  },

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
        fileToTranscribe = await this.convertToCompatibleFormat(audioFile);
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
