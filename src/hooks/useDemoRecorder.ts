import { COOLDOWN_TIME, MAX_DEMO_DURATION } from "@src/constants/demoConstants";
import { useCallback, useEffect } from "react";
import { useCountdown } from "./_useDemoRecorder/useCountdown";
import { useDemoAudioHandling } from "./_useDemoRecorder/useDemoAudioHandling";
import { useDemoRecordingActions } from "./_useDemoRecorder/useDemoRecordingActions";
import { useDemoRecordingState } from "./_useDemoRecorder/useDemoRecordingState";
import { useDemoTrialManagement } from "./_useDemoRecorder/useDemoTrialManagement";

export const useDemoRecorder = () => {
  const {
    micPermission,
    setMicPermission,
    startRecording: startAudioRecording,
    stopRecording: stopAudioRecording,
    pauseRecording,
    resumeRecording,
    getAudioMimeType,
    chunksRef,
    cleanupAudioResources,
  } = useDemoAudioHandling();

  const {
    isRecording,
    setIsRecording,
    isPaused,
    setIsPaused,
    isProcessing,
    setIsProcessing,
    error,
    setError,
    demoResult,
    setDemoResult,
    recordingTime,
    setRecordingTime,
    timerRef,
    shouldProcessRef,
  } = useDemoRecordingState();

  const {
    trialCount,
    decrementTrialCount,
    trialLimitReached,
    setTrialLimitReached,
    showLimitModal,
    setShowLimitModal,
    handleCountdownComplete,
  } = useDemoTrialManagement(false, () => {});

  const {
    timeLeft,
    isActive: isCooldownActive,
    startCountdown,
    // stopCountdown,
    // resetCountdown,
  } = useCountdown(COOLDOWN_TIME, handleCountdownComplete);

  useEffect(() => {
    if (timeLeft === 0 && isCooldownActive) {
      handleCountdownComplete();
    }
  }, [timeLeft, isCooldownActive, handleCountdownComplete]);

  const { finishRecording, startRecording, stopRecording, pauseResumeRecording, cancelRecording } =
    useDemoRecordingActions(
      startAudioRecording,
      stopAudioRecording,
      pauseRecording,
      resumeRecording,
      cleanupAudioResources,
      getAudioMimeType,
      chunksRef,
      timerRef,
      shouldProcessRef,
      setIsRecording,
      setIsPaused,
      setIsProcessing,
      setError,
      setDemoResult,
      setRecordingTime,
      trialLimitReached,
      setTrialLimitReached,
      decrementTrialCount,
      startCountdown,
      MAX_DEMO_DURATION
    );

  const handleFinishRecording = useCallback(async () => {
    await finishRecording();
    if (!trialLimitReached) {
      decrementTrialCount();
    }
  }, [finishRecording, trialLimitReached, decrementTrialCount]);

  return {
    isRecording,
    isPaused,
    isProcessing,
    error,
    demoResult,
    micPermission,
    setMicPermission,
    recordingTime,
    maxRecordingDuration: MAX_DEMO_DURATION,
    startRecording,
    stopRecording,
    pauseResumeRecording,
    finishRecording: handleFinishRecording,
    cancelRecording,
    trialLimitReached,
    trialCount,
    showLimitModal,
    setShowLimitModal,
    isCooldownActive,
    cooldownTimeLeft: timeLeft,
    startCountdown,
  };
};
