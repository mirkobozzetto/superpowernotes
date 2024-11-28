import { createBrowserDetection } from "@src/utils/browserDetection";
import { create } from "zustand";

type AudioHandlingState = {
  micPermission: boolean | null;
  mediaRecorder: MediaRecorder | null;
  stream: MediaStream | null;
  chunks: Blob[];
  isIOS: boolean;
  isExtension: boolean;
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
  initializeForExtension: () => void;
  debugLog: (message: string, data?: any) => void;
  updateBrowserInfo: () => void;
};

export const useAudioHandlingStore = create<AudioHandlingState>((set, get) => {
  const debugLog = (message: string, data?: any) => {
    const timestamp = new Date().toISOString();
    console.group(`🎙 [${timestamp}] Audio Recording`);
    console.log(message);
    if (data) console.log(data);
    console.groupEnd();
  };

  return {
    micPermission: null,
    mediaRecorder: null,
    stream: null,
    chunks: [],
    isIOS: false,
    isExtension: false,
    debugLog,

    updateBrowserInfo: () => {
      const browserInfo = createBrowserDetection();
      debugLog("Browser detection:", browserInfo);
      set({ isIOS: browserInfo.isIOS });
    },

    initializeForExtension: () => {
      debugLog("Initializing for extension");
      const browserInfo = createBrowserDetection();
      set({
        isExtension: true,
        micPermission: true,
        isIOS: browserInfo.isIOS,
      });
    },

    getAudioMimeType: () => {
      const preferredTypes = ["audio/mp4", "audio/aac", "audio/webm"];
      const supportedType = preferredTypes.find((type) => {
        const isSupported = MediaRecorder.isTypeSupported(type);
        get().debugLog(`Testing format ${type}:`, isSupported);
        return isSupported;
      });

      const finalType = supportedType || "audio/mp4";
      get().debugLog("Selected audio format:", finalType);
      return finalType;
    },

    setMicPermission: (permission) => {
      get().debugLog("Setting mic permission:", permission);
      set({ micPermission: permission });
    },

    startRecording: async (onDataAvailable, onStop) => {
      const debug = get().debugLog;
      debug("Starting recording");

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });

        debug("Got audio stream");
        const mimeType = get().getAudioMimeType();

        const options = {
          mimeType,
          audioBitsPerSecond: 128000,
        };

        debug("Creating MediaRecorder with options:", options);
        const mediaRecorder = new MediaRecorder(stream, options);

        let hasDataAvailable = false;

        mediaRecorder.ondataavailable = (event) => {
          debug("Data available:", { size: event.data.size, type: event.data.type });
          if (event.data.size > 0 && !hasDataAvailable) {
            hasDataAvailable = true;
            set((state) => ({ chunks: [...state.chunks, event.data] }));
            onDataAvailable(event);
          }
        };

        mediaRecorder.onstop = () => {
          debug("Recording stopped");
          onStop();
          get().cleanupAudioResources();
        };

        set({ stream, mediaRecorder, chunks: [] });

        const timeslice = get().isIOS ? 3000 : undefined;
        debug("Starting MediaRecorder with timeslice:", timeslice);
        mediaRecorder.start(timeslice);

        set({ micPermission: true });
      } catch (error) {
        debug("Error starting recording:", error);
        set({ micPermission: false });
        throw error;
      }
    },

    stopRecording: () => {
      const { mediaRecorder } = get();
      const debug = get().debugLog;

      if (mediaRecorder && mediaRecorder.state !== "inactive") {
        debug("Stopping recording");
        mediaRecorder.stop();
      } else {
        debug("Cannot stop recording - recorder inactive or null");
      }
    },

    pauseRecording: () => {
      const { mediaRecorder } = get();
      const debug = get().debugLog;

      if (mediaRecorder && mediaRecorder.state === "recording") {
        debug("Pausing recording");
        mediaRecorder.pause();
      } else {
        debug("Cannot pause recording - not in recording state");
      }
    },

    resumeRecording: () => {
      const { mediaRecorder } = get();
      const debug = get().debugLog;

      if (mediaRecorder && mediaRecorder.state === "paused") {
        debug("Resuming recording");
        mediaRecorder.resume();
      } else {
        debug("Cannot resume recording - not in paused state");
      }
    },

    cleanupAudioResources: () => {
      const { stream } = get();
      const debug = get().debugLog;

      debug("Cleaning up audio resources");
      if (stream) {
        stream.getTracks().forEach((track) => {
          debug("Stopping track:", track.kind);
          track.stop();
        });
      }
      set({ stream: null, mediaRecorder: null });
    },
  };
});
