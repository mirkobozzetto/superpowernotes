export type AudioMimeType = "audio/wav" | "audio/webm";

export type AudioRecordingCallbacks = {
  onDataAvailable: (event: BlobEvent) => void | number;
  onStop: () => void | Promise<void>;
  shouldProcessAudio: () => boolean;
};
