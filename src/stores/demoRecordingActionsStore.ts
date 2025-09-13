import { MAX_DEMO_DURATION } from "@src/constants/demoConstants";
import { demoTranscriptionService } from "@src/services/demoTranscriptionService";
import { DemoRecordingStore } from "@src/types/demoRecordingActions";
import { create } from "zustand";

export const useDemoRecordingActionsStore = create<DemoRecordingStore>((set, get) => ({
  isRecording: false,
  isPaused: false,
  isProcessing: false,
  error: null,
  demoResult: null,
  recordingTime: 0,
  trialLimitReached: false,
  trialCount: 0,
  showLimitModal: false,
  isCooldownActive: false,
  cooldownTimeLeft: 0,
  chunks: [],
  shouldProcess: true,
  timer: null,

  setIsRecording: (isRecording) => set({ isRecording }),
  setIsPaused: (isPaused) => set({ isPaused }),
  setIsProcessing: (isProcessing) => set({ isProcessing }),
  setError: (error) => set({ error }),
  setDemoResult: (result) => set({ demoResult: result }),
  setRecordingTime: (time) => set({ recordingTime: time }),
  setTrialLimitReached: (reached) => set({ trialLimitReached: reached }),
  setShowLimitModal: (show) => set({ showLimitModal: show }),
  decrementTrialCount: () => set((state) => ({ trialCount: state.trialCount - 1 })),

  startCountdown: () => {},
  handleCountdownComplete: () => {},

  startRecording: async (startAudioRecording, getAudioMimeType) => {
    const { setError, setDemoResult, setRecordingTime, setIsRecording, setIsPaused } = get();

    setError(null);
    setDemoResult(null);
    set({ chunks: [], shouldProcess: true });
    setRecordingTime(0);

    try {
      await startAudioRecording(
        (event) => set((state) => ({ chunks: [...state.chunks, event.data] })),
        () =>
          get().finishRecording(
            () => {},
            () => {},
            getAudioMimeType
          ),
        () => get().shouldProcess
      );

      setIsRecording(true);
      setIsPaused(false);

      set({
        timer: setInterval(() => {
          set((state) => {
            const newTime = state.recordingTime + 1;
            if (newTime >= MAX_DEMO_DURATION) {
              get().finishRecording(
                () => {},
                () => {},
                getAudioMimeType
              );
              return { recordingTime: MAX_DEMO_DURATION };
            }
            return { recordingTime: newTime };
          });
        }, 1000) as ReturnType<typeof setTimeout>,
      });
    } catch (error) {
      console.error("Error starting demo recording:", error);
      setError(
        "Échec du démarrage de l'enregistrement. Veuillez vérifier les permissions de votre microphone."
      );
    }
  },

  stopRecording: () => {
    get().finishRecording(
      () => {},
      () => {},
      () => ""
    );
  },

  pauseResumeRecording: (pauseRecording, resumeRecording) => {
    set((state) => {
      const newIsPaused = !state.isPaused;
      if (newIsPaused) {
        pauseRecording();
        if (state.timer) {
          clearInterval(state.timer);
        }
      } else {
        resumeRecording();
        const newTimer = setInterval(() => {
          set((s) => ({ recordingTime: s.recordingTime + 1 }));
        }, 1000) as ReturnType<typeof setTimeout>;
        return { isPaused: newIsPaused, timer: newTimer };
      }
      return { isPaused: newIsPaused, timer: null };
    });
  },

  cancelRecording: (stopAudioRecording, cleanupAudioResources) => {
    stopAudioRecording();
    cleanupAudioResources();
    set((state) => {
      if (state.timer) {
        clearInterval(state.timer);
      }
      return {
        isRecording: false,
        isPaused: false,
        error: null,
        demoResult: null,
        recordingTime: 0,
        chunks: [],
        shouldProcess: false,
        timer: null,
      };
    });
  },

  finishRecording: async (stopAudioRecording, cleanupAudioResources, getAudioMimeType) => {
    const { chunks, shouldProcess, recordingTime, setError, setDemoResult, setIsProcessing } =
      get();

    stopAudioRecording();
    set((state) => {
      if (state.timer) {
        clearInterval(state.timer);
      }
      return {
        isRecording: false,
        isPaused: false,
        timer: null,
      };
    });

    if (chunks.length > 0 && shouldProcess) {
      setIsProcessing(true);
      const audioBlob = new Blob(chunks, { type: getAudioMimeType() });

      try {
        const result = await demoTranscriptionService(audioBlob, recordingTime);
        setDemoResult(result);
      } catch (error: unknown) {
        console.error("Error processing demo recording:", error);
        setError("Échec du traitement de l'enregistrement. Veuillez réessayer.");
      } finally {
        setIsProcessing(false);
      }
    }
    cleanupAudioResources();
    set({ shouldProcess: true });
  },
}));
