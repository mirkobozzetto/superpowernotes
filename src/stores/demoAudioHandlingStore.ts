import { create } from "zustand";

interface DemoAudioHandlingState {
  micPermission: boolean | null;
  mediaRecorder: MediaRecorder | null;
  stream: MediaStream | null;
  chunks: Blob[];
  isIOS: boolean;
  setMicPermission: (permission: boolean) => void;
  startRecording: (
    onDataAvailable: (event: BlobEvent) => void,
    onStop: () => void,
    shouldProcessAudio: () => boolean
  ) => Promise<void>;
  stopRecording: () => void;
  pauseRecording: () => void;
  resumeRecording: () => void;
  getAudioMimeType: () => string;
  cleanupAudioResources: () => void;
}

export const useDemoAudioHandlingStore = create<DemoAudioHandlingState>((set, get) => ({
  micPermission: null,
  mediaRecorder: null,
  stream: null,
  chunks: [],
  isIOS: false,

  setMicPermission: (permission: boolean) => set({ micPermission: permission }),

  startRecording: async (
    onDataAvailable: (event: BlobEvent) => void,
    onStop: () => void,
    shouldProcessAudio: () => boolean
  ) => {
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
        if (shouldProcessAudio()) {
          onStop();
        }
        get().cleanupAudioResources();
      };

      mediaRecorder.start();
      set({ micPermission: true });
    } catch (error) {
      console.error("Error starting demo recording:", error);
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

  getAudioMimeType: () => {
    return get().isIOS ? "audio/wav" : "audio/webm";
  },

  cleanupAudioResources: () => {
    const { stream } = get();
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    set({ stream: null, mediaRecorder: null });
  },
}));
