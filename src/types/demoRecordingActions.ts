export type DemoRecordingActionsState = {
  isRecording: boolean;
  isPaused: boolean;
  isProcessing: boolean;
  error: string | null;
  demoResult: { transcription: string; tags: string[] } | null;
  recordingTime: number;
  trialLimitReached: boolean;
  trialCount: number;
  showLimitModal: boolean;
  isCooldownActive: boolean;
  cooldownTimeLeft: number;
  chunks: Blob[];
  shouldProcess: boolean;
  timer: NodeJS.Timeout | null;
};

export type DemoRecordingActions = {
  setIsRecording: (isRecording: boolean) => void;
  setIsPaused: (isPaused: boolean) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  setError: (error: string | null) => void;
  setDemoResult: (result: { transcription: string; tags: string[] } | null) => void;
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
