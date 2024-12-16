import { AUDIO_MIME_TYPES } from "@src/constants/audioConstants";
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
      const browserInfo = createBrowserDetection();
      debugLog("Checking available audio formats", {
        browser: browserInfo,
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
      });

      const preferredFormats =
        browserInfo.browser === "safari" || browserInfo.isIOS
          ? [AUDIO_MIME_TYPES.MP3, AUDIO_MIME_TYPES.AAC]
          : [AUDIO_MIME_TYPES.WEBM];

      debugLog("Testing formats for browser", {
        preferredFormats,
        browser: browserInfo.browser,
      });

      for (const format of preferredFormats) {
        const isSupported = MediaRecorder.isTypeSupported(format);
        debugLog(`Testing format ${format}:`, {
          isSupported,
          browser: browserInfo,
        });
        if (isSupported) {
          debugLog("Found supported format:", format);
          return format;
        }
      }

      const allFormats = Object.values(AUDIO_MIME_TYPES);
      for (const format of allFormats) {
        const isSupported = MediaRecorder.isTypeSupported(format);
        if (isSupported) {
          debugLog("Found fallback format:", format);
          return format;
        }
      }

      debugLog("No supported format found, using basic audio");
      return "audio/mp4";
    },

    setMicPermission: (permission) => {
      debugLog("Setting microphone permission:", {
        permission,
        previous: get().micPermission,
      });
      set({ micPermission: permission });
    },

    startRecording: async (onDataAvailable, onStop) => {
      const browserInfo = createBrowserDetection();
      const debug = get().debugLog;

      debug("Starting recording attempt", {
        browser: browserInfo,
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
        isIOS: browserInfo.isIOS,
      });

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });

        debug("Audio stream obtained", {
          tracks: stream.getAudioTracks().map((track) => ({
            kind: track.kind,
            label: track.label,
            enabled: track.enabled,
            constraints: track.getConstraints(),
          })),
        });

        set({ micPermission: true });
        const mimeType = get().getAudioMimeType();

        const options = {
          mimeType,
          audioBitsPerSecond: 128000,
        };

        debug("Initializing MediaRecorder", { options });

        try {
          const mediaRecorder = new MediaRecorder(stream, options);
          debug("MediaRecorder created successfully");

          mediaRecorder.ondataavailable = (event) => {
            debug("Data available from MediaRecorder:", {
              size: event.data.size,
              type: event.data.type,
            });

            if (event.data.size > 0) {
              set((state) => ({ chunks: [...state.chunks, event.data] }));
              onDataAvailable(event);
            }
          };

          mediaRecorder.onstop = () => {
            debug("MediaRecorder stopped");
            onStop();
            get().cleanupAudioResources();
          };

          set({ stream, mediaRecorder, chunks: [] });
          debug("Starting MediaRecorder");
          mediaRecorder.start();
        } catch (recorderError) {
          debug("MediaRecorder initialization failed", {
            error: recorderError instanceof Error ? recorderError.message : "Unknown error",
            name: recorderError instanceof Error ? recorderError.name : "Unknown",
            mimeType,
            browser: browserInfo,
          });
          throw recorderError;
        }
      } catch (error) {
        debug("Recording setup failed", {
          errorType: error instanceof Error ? error.name : "Unknown",
          errorMessage: error instanceof Error ? error.message : "Unknown error",
          stack: error instanceof Error ? error.stack : undefined,
          browser: browserInfo,
        });

        if (
          error instanceof Error &&
          (error.name === "NotAllowedError" || error.name === "PermissionDeniedError")
        ) {
          debug("Microphone permission denied");
          set({ micPermission: false });
        }
        throw error;
      }
    },

    stopRecording: () => {
      const { mediaRecorder } = get();
      const debug = get().debugLog;

      if (mediaRecorder && mediaRecorder.state !== "inactive") {
        debug("Stopping recording", {
          state: mediaRecorder.state,
          mimeType: mediaRecorder.mimeType,
        });
        mediaRecorder.stop();
      } else {
        debug("Cannot stop recording - recorder inactive or null", {
          recorderState: mediaRecorder?.state || "null",
        });
      }
    },

    pauseRecording: () => {
      const { mediaRecorder } = get();
      const debug = get().debugLog;

      if (mediaRecorder && mediaRecorder.state === "recording") {
        debug("Pausing recording");
        mediaRecorder.pause();
      } else {
        debug("Cannot pause recording", {
          state: mediaRecorder?.state || "null",
        });
      }
    },

    resumeRecording: () => {
      const { mediaRecorder } = get();
      const debug = get().debugLog;

      if (mediaRecorder && mediaRecorder.state === "paused") {
        debug("Resuming recording");
        mediaRecorder.resume();
      } else {
        debug("Cannot resume recording", {
          state: mediaRecorder?.state || "null",
        });
      }
    },

    cleanupAudioResources: () => {
      const { stream } = get();
      const debug = get().debugLog;

      debug("Cleaning up audio resources");
      if (stream) {
        stream.getTracks().forEach((track) => {
          debug("Stopping audio track", {
            kind: track.kind,
            label: track.label,
            enabled: track.enabled,
          });
          track.stop();
        });
      }
      set({ stream: null, mediaRecorder: null });
    },
  };
});
