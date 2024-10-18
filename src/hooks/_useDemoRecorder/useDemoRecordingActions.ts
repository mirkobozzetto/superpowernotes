import { MAX_DEMO_DURATION } from "@src/constants/demoConstants";
import { useDemoRecordingActionsStore } from "@src/stores/demoRecordingActionsStore";
import { useCallback } from "react";

export const useDemoRecordingActions = (
  startAudioRecording: (
    onDataAvailable: (event: BlobEvent) => void,
    onStop: () => void,
    shouldProcessAudio: () => boolean
  ) => Promise<void>,
  stopAudioRecording: () => void,
  pauseRecording: () => void,
  resumeRecording: () => void,
  cleanupAudioResources: () => void,
  getAudioMimeType: () => string
) => {
  const {
    isRecording,
    isPaused,
    isProcessing,
    error,
    demoResult,
    recordingTime,
    trialLimitReached,
    trialCount,
    showLimitModal,
    isCooldownActive,
    cooldownTimeLeft,
    startRecording: storeStartRecording,
    stopRecording: storeStopRecording,
    pauseResumeRecording: storePauseResumeRecording,
    cancelRecording: storeCancelRecording,
    finishRecording: storeFinishRecording,
    startCountdown,
    handleCountdownComplete,
    setShowLimitModal,
  } = useDemoRecordingActionsStore();

  const startRecording = useCallback(async () => {
    await storeStartRecording(startAudioRecording, getAudioMimeType);
  }, [storeStartRecording, startAudioRecording, getAudioMimeType]);

  const stopRecording = useCallback(() => {
    storeStopRecording();
  }, [storeStopRecording]);

  const pauseResumeRecording = useCallback(() => {
    storePauseResumeRecording(pauseRecording, resumeRecording);
  }, [storePauseResumeRecording, pauseRecording, resumeRecording]);

  const cancelRecording = useCallback(() => {
    storeCancelRecording(stopAudioRecording, cleanupAudioResources);
  }, [storeCancelRecording, stopAudioRecording, cleanupAudioResources]);

  const finishRecording = useCallback(async () => {
    await storeFinishRecording(stopAudioRecording, cleanupAudioResources, getAudioMimeType);
  }, [storeFinishRecording, stopAudioRecording, cleanupAudioResources, getAudioMimeType]);

  return {
    isRecording,
    isPaused,
    isProcessing,
    error,
    demoResult,
    recordingTime,
    trialLimitReached,
    trialCount,
    showLimitModal,
    isCooldownActive,
    cooldownTimeLeft,
    startRecording,
    stopRecording,
    pauseResumeRecording,
    cancelRecording,
    finishRecording,
    startCountdown,
    handleCountdownComplete,
    setShowLimitModal,
    maxRecordingDuration: MAX_DEMO_DURATION,
  };
};
