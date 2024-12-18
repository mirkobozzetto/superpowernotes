import { AUDIO_MIME_TYPES } from "@src/constants/audioConstants";
import { logger } from "@src/lib/logger";

const CONVERSION_SERVICE_URL = process.env.CONVERSION_SERVICE_URL || "http://localhost:4000";

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
      throw new AudioConversionError(
        errorData.error || "Failed to convert audio",
        errorData.code || "CONVERSION_FAILED"
      );
    }

    const convertedBuffer = await response.arrayBuffer();
    return new File([convertedBuffer], "converted.mp3", {
      type: AUDIO_MIME_TYPES.MP3,
    });
  },
};
