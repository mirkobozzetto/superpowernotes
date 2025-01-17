import { AUDIO_MIME_TYPES } from "@src/constants/audioConstants";
import { logger } from "@src/lib/logger";

const CONVERSION_SERVICE_URL = process.env.CONVERSION_SERVICE_URL || "http://localhost:4000";
const CONVERSION_TIMEOUT = 30000;

export class AudioConversionError extends Error {
  constructor(
    message: string,
    public code: string
  ) {
    super(message);
    this.name = "AudioConversionError";
  }
}

export const audioConversionService = {
  async convertToCompatibleFormat(audioFile: File): Promise<File> {
    const arrayBuffer = await audioFile.arrayBuffer();

    logger.info("Starting conversion request", {
      url: CONVERSION_SERVICE_URL,
      fileType: audioFile.type,
      fileSize: arrayBuffer.byteLength,
    });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CONVERSION_TIMEOUT);

    try {
      const response = await fetch(`${CONVERSION_SERVICE_URL}/convert`, {
        method: "POST",
        headers: {
          "Content-Type": audioFile.type,
        },
        body: arrayBuffer,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      logger.info("Received response from conversion service", {
        status: response.status,
        ok: response.ok,
      });

      if (!response.ok) {
        const errorData = await response.json();
        logger.error("Conversion failed", {
          status: response.status,
          error: errorData.error,
          code: errorData.code,
        });
        throw new AudioConversionError(
          errorData.error || "Failed to convert audio",
          errorData.code || "CONVERSION_FAILED"
        );
      }

      const convertedBuffer = await response.arrayBuffer();
      logger.info("Conversion successful", {
        originalSize: arrayBuffer.byteLength,
        convertedSize: convertedBuffer.byteLength,
      });

      return new File([convertedBuffer], "converted.mp3", {
        type: AUDIO_MIME_TYPES.MP3,
      });
    } catch (error) {
      clearTimeout(timeoutId);

      if ((error as Error).name === "AbortError") {
        logger.error("Conversion timeout", {
          fileType: audioFile.type,
          fileSize: arrayBuffer.byteLength,
        });
        throw new AudioConversionError(
          "Conversion timed out after 30 seconds",
          "CONVERSION_TIMEOUT"
        );
      }

      logger.error("Conversion error", {
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      });

      throw new AudioConversionError("Failed to convert audio", "CONVERSION_FAILED");
    }
  },
};
