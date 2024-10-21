import { create } from "zustand";

type AudioHandlingState = {
  micPermission: boolean | null;
  mediaRecorder: MediaRecorder | null;
  stream: MediaStream | null;
  chunks: Blob[];
  isIOS: boolean;
  getAudioMimeType: () => string;
  setMicPermission: (permission: boolean) => void;
  startRecording: (
    onDataAvailable: (event: BlobEvent) => void,
    onStop: () => void
  ) => Promise<void>;
  stopRecording: () => void;
  pauseRecording: () => void;
  resumeRecording: () => void;
  cleanupAudioResources: () => void;
};

export const useAudioHandlingStore = create<AudioHandlingState>((set, get) => ({
  micPermission: null,
  mediaRecorder: null,
  stream: null,
  chunks: [],
  isIOS: false,

  getAudioMimeType: () => (get().isIOS ? "audio/wav" : "audio/webm"),

  setMicPermission: (permission) => set({ micPermission: permission }),

  startRecording: async (onDataAvailable, onStop) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = get().getAudioMimeType();
      const mediaRecorder = new MediaRecorder(stream, { mimeType });

      set({ stream, mediaRecorder, chunks: [] });

      mediaRecorder.ondataavailable = (event) => {
        set((state) => ({ chunks: [...state.chunks, event.data] }));
        onDataAvailable(event);
      };

      mediaRecorder.onstop = () => {
        onStop();
        get().cleanupAudioResources();
      };

      mediaRecorder.start();
      set({ micPermission: true });
    } catch (error) {
      console.error("Error starting recording:", error);
      set({ micPermission: false });
    }
  },

  stopRecording: () => {
    const { mediaRecorder } = get();
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
    }
  },

  pauseRecording: () => {
    const { mediaRecorder } = get();
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.pause();
    }
  },

  resumeRecording: () => {
    const { mediaRecorder } = get();
    if (mediaRecorder && mediaRecorder.state === "paused") {
      mediaRecorder.resume();
    }
  },

  cleanupAudioResources: () => {
    const { stream } = get();
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    set({ stream: null, mediaRecorder: null });
  },
}));
