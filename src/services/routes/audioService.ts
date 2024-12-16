import { AUDIO_MIME_TYPES, WHISPER_SUPPORTED_FORMATS } from "@src/constants/audioConstants";
import { logger } from "@src/lib/logger";
import { SaveVoiceNoteInputSchema, VoiceNoteResponseSchema } from "@src/validations/audioService";
import ffmpeg from "fluent-ffmpeg";
import OpenAI from "openai";
import { PassThrough, Readable } from "stream";
import { prisma } from "../../lib/prisma";

export type AudioMimeType = (typeof AUDIO_MIME_TYPES)[keyof typeof AUDIO_MIME_TYPES];
export type WhisperFormat = (typeof WHISPER_SUPPORTED_FORMATS)[number];

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

const createReadStream = (buffer: Buffer): Readable => {
  return new Readable({
    read() {
      this.push(buffer);
      this.push(null);
    },
  });
};

export const audioService = {
  async convertToCompatibleFormat(audioFile: File): Promise<File> {
    const arrayBuffer = await audioFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const inputStream = createReadStream(buffer);
    const passThrough = new PassThrough();

    return new Promise<File>((resolve, reject) => {
      const chunks: Uint8Array[] = [];

      ffmpeg(inputStream)
        .toFormat("mp3")
        .audioCodec("libmp3lame")
        .audioBitrate(128)
        .on("error", (err: Error) => {
          logger.error("Audio conversion failed", { error: err.message });
          reject(new AudioServiceError("Failed to convert audio", "CONVERSION_FAILED"));
        })
        .pipe(passThrough);

      passThrough.on("data", (chunk: Uint8Array) => {
        chunks.push(chunk);
      });

      passThrough.on("end", () => {
        const concatenatedBuffer = Buffer.concat(chunks);
        const convertedFile = new File([concatenatedBuffer], "converted.mp3", {
          type: AUDIO_MIME_TYPES.MP3,
        });
        resolve(convertedFile);
      });

      passThrough.on("error", (err) => {
        logger.error("Stream error:", err);
        reject(new AudioServiceError("Failed to process audio stream", "STREAM_ERROR"));
      });
    });
  },

  async transcribeAudio(audioFile: File): Promise<string> {
    try {
      let fileToTranscribe = audioFile;

      if (!WHISPER_SUPPORTED_FORMATS.includes(audioFile.type as WhisperFormat)) {
        logger.info("Converting audio to compatible format", {
          originalFormat: audioFile.type,
          originalSize: audioFile.size,
        });
        fileToTranscribe = await this.convertToCompatibleFormat(audioFile);
      }

      const transcription = await openai.audio.transcriptions.create({
        file: fileToTranscribe,
        model: "whisper-1",
      });

      logger.info("Audio transcription successful", {
        fileSize: fileToTranscribe.size,
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
