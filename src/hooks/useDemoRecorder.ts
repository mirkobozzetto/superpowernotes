import { COOLDOWN_TIME, MAX_DEMO_DURATION } from "@src/constants/demoConstants";
import { useCallback, useEffect, useState } from "react";
import { useCountdown } from "./_useDemoRecorder/useCountdown";
import { useDemoAudioHandling } from "./_useDemoRecorder/useDemoAudioHandling";
import { useDemoRecordingActions } from "./_useDemoRecorder/useDemoRecordingActions";

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

  const [showLimitModal, setShowLimitModal] = useState(false);
  const [trialLimitReached, setTrialLimitReached] = useState(false);
  const [trialCount, setTrialCount] = useState(0);

  const handleCountdownComplete = useCallback(() => {
    setTrialLimitReached(false);
    setTrialCount(0);
    setShowLimitModal(false);
  }, []);

  const {
    timeLeft: cooldownTimeLeft,
    isActive: isCooldownActive,
    startCountdown,
  } = useCountdown(COOLDOWN_TIME, handleCountdownComplete);

  const {
    isRecording,
    isPaused,
    isProcessing,
    error,
    demoResult,
    recordingTime,
    finishRecording,
    startRecording,
    stopRecording,
    pauseResumeRecording,
    cancelRecording,
  } = useDemoRecordingActions(
    startAudioRecording,
    stopAudioRecording,
    pauseRecording,
    resumeRecording,
    cleanupAudioResources,
    getAudioMimeType
  );

  const decrementTrialCount = useCallback(() => {
    setTrialCount((prevCount) => {
      const newCount = prevCount - 1;
      if (newCount <= 0) {
        setTrialLimitReached(true);
        startCountdown();
      }
      return newCount;
    });
  }, [startCountdown]);

  const handleFinishRecording = useCallback(async () => {
    await finishRecording();
    if (!trialLimitReached) {
      decrementTrialCount();
    }
  }, [finishRecording, trialLimitReached, decrementTrialCount]);

  useEffect(() => {
    if (trialLimitReached && !isCooldownActive) {
      setShowLimitModal(true);
    }
  }, [trialLimitReached, isCooldownActive]);

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
    cooldownTimeLeft,
    startCountdown,
  };
};
