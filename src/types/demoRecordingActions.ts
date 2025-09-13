export type DemoResult = {
  transcription: string;
  tags: string[];
  fileName: string;
};

export type DemoRecordingActionsState = {
  isRecording: boolean;
  isPaused: boolean;
  isProcessing: boolean;
  error: string | null;
  demoResult: DemoResult | null; // Ici on utilise DemoResult
  recordingTime: number;
  trialLimitReached: boolean;
  trialCount: number;
  showLimitModal: boolean;
  isCooldownActive: boolean;
  cooldownTimeLeft: number;
  chunks: Blob[];
  shouldProcess: boolean;
  timer: ReturnType<typeof setTimeout> | null;
};

export type DemoRecordingActions = {
  setIsRecording: (isRecording: boolean) => void;
  setIsPaused: (isPaused: boolean) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  setError: (error: string | null) => void;
  setDemoResult: (result: DemoResult | null) => void; // Et ici aussi
  setRecordingTime: (time: number) => void;
  setTrialLimitReached: (reached: boolean) => void;
  setShowLimitModal: (show: boolean) => void;
  decrementTrialCount: () => void;
  startCountdown: () => void;
  handleCountdownComplete: () => void;
  startRecording: (
    startAudioRecording: (
      onDataAvailable: (event: BlobEvent) => void,
      onStop: () => void,
      shouldProcessAudio: () => boolean
    ) => Promise<void>,
    getAudioMimeType: () => string
  ) => Promise<void>;
  stopRecording: () => void;
  pauseResumeRecording: (pauseRecording: () => void, resumeRecording: () => void) => void;
  cancelRecording: (stopAudioRecording: () => void, cleanupAudioResources: () => void) => void;
  finishRecording: (
    stopAudioRecording: () => void,
    cleanupAudioResources: () => void,
    getAudioMimeType: () => string
  ) => Promise<void>;
};

export type DemoRecordingStore = DemoRecordingActionsState & DemoRecordingActions;
