export const AUDIO_MIME_TYPES = {
  WEBM: "audio/webm",
  AAC: "audio/aac",
  MP3: "audio/mpeg",
} as const;

export const WHISPER_SUPPORTED_FORMATS = [
  "audio/webm",
  "audio/mpeg",
  "audio/wav",
  "audio/ogg",
] as const;
