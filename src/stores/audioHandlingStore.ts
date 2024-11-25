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
};

type BrowserInfo = {
  isIOS: boolean;
  browser: string;
  version: string;
};

const detectBrowser = (): BrowserInfo => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  const isIOS = /iphone|ipad|ipod/.test(userAgent);
  const isSafari = /safari/.test(userAgent);
  const isChrome = /chrome/.test(userAgent);
  const browser = isChrome ? "chrome" : isSafari ? "safari" : "other";
  const version = userAgent.match(/(version|chrome)\/(\d+)/)?.[2] || "unknown";

  return { isIOS, browser, version };
};

const getSupportedMimeType = (debug: (msg: string, data?: any) => void): string => {
  const preferredTypes = ["audio/mp4", "audio/aac", "audio/webm"];

  debug("Testing supported audio formats");
  const supportedType = preferredTypes.find((type) => {
    const isSupported = MediaRecorder.isTypeSupported(type);
    debug(`Format ${type} supported:`, isSupported);
    return isSupported;
  });

  const finalType = supportedType || "audio/mp4";
  debug("Selected audio format:", finalType);
  return finalType;
};

export const useAudioHandlingStore = create<AudioHandlingState>((set, get) => {
  const browserInfo = detectBrowser();
  const debugLog = (message: string, data?: any) => {
    const timestamp = new Date().toISOString();
    console.group(`🎙 [${timestamp}] Audio Recording`);
    console.log(message);
    if (data) console.log(data);
    console.groupEnd();
  };

  debugLog("Browser Detection:", browserInfo);

  return {
    micPermission: null,
    mediaRecorder: null,
    stream: null,
    chunks: [],
    isIOS: browserInfo.isIOS,
    isExtension: false,
    debugLog,

    initializeForExtension: () => {
      debugLog("Initializing for extension");
      set({
        isExtension: true,
        micPermission: true,
      });
    },

    getAudioMimeType: () => getSupportedMimeType(get().debugLog),

    setMicPermission: (permission) => {
      debugLog("Setting mic permission:", permission);
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

        mediaRecorder.ondataavailable = (event) => {
          debug("Data available:", { size: event.data.size, type: event.data.type });
          if (event.data.size > 0) {
            set((state) => ({ chunks: [...state.chunks, event.data] }));
            onDataAvailable(event);
          }
        };

        mediaRecorder.onstop = () => {
          debug("Recording stopped");
          onStop();
          get().cleanupAudioResources();
        };

        mediaRecorder.onerror = (event) => {
          debug("MediaRecorder error:", event);
        };

        set({ stream, mediaRecorder, chunks: [] });

        const timeslice = get().isIOS ? 1000 : undefined;
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
