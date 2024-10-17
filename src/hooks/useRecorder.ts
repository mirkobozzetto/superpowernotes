import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { useAudioHandling } from "./_useRecorder/useAudioHandling";
import { useRecordingActions } from "./_useRecorder/useRecordingActions";
import { useRecordingState } from "./_useRecorder/useRecordingState";
import { useServerCommunication } from "./_useRecorder/useServerCommunication";
import { useTimeManagement } from "./_useRecorder/useTimeManagement";

const MAX_RECORDING_DURATION = 120;

export const useRecorder = () => {
  const { data: session } = useSession();
  const [isCancelling, setIsCancelling] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);

  const {
    micPermission,
    setMicPermission,
    startRecording: startAudioRecording,
    stopRecording: stopAudioRecording,
    pauseRecording: pauseAudioRecording,
    resumeRecording: resumeAudioRecording,
    getAudioMimeType,
    chunksRef,
    isIOSRef,
    cleanupAudioResources,
  } = useAudioHandling();

  const { remainingTime, setRemainingTime, recordingTime, setRecordingTime, fetchRemainingTime } =
    useTimeManagement();

  const {
    isRecording,
    setIsRecording,
    isPaused,
    setIsPaused,
    isProcessing,
    setIsProcessing,
    error,
    setError,
    isSuccess,
    setIsSuccess,
    startTimeRef,
    timerRef,
  } = useRecordingState();

  const { sendAudioToServer } = useServerCommunication(
    setError,
    setIsSuccess,
    setRemainingTime,
    setIsFinishing
  );

  const actualRecordingTimeRef = useRef(0);

  const { finishRecording, startRecording, stopRecording, pauseResumeRecording, cancelRecording } =
    useRecordingActions(
      isCancelling,
      remainingTime,
      startAudioRecording,
      stopAudioRecording,
      pauseAudioRecording,
      resumeAudioRecording,
      getAudioMimeType,
      cleanupAudioResources,
      sendAudioToServer,
      setError,
      setIsRecording,
      setIsPaused,
      setIsSuccess,
      setRecordingTime,
      setIsProcessing,
      setIsFinishing,
      setIsCancelling,
      chunksRef,
      startTimeRef,
      timerRef,
      actualRecordingTimeRef
    );

  useEffect(() => {
    setIsProcessing(isFinishing);
  }, [isFinishing, setIsProcessing]);

  useEffect(() => {
    if (isSuccess) {
      fetchRemainingTime();
    }
  }, [isSuccess, fetchRemainingTime]);

  return {
    isRecording,
    isPaused,
    error,
    micPermission,
    setMicPermission,
    startRecording,
    stopRecording,
    pauseResumeRecording,
    finishRecording,
    cancelRecording,
    isSuccess,
    session,
    recordingTime: actualRecordingTimeRef.current,
    maxRecordingDuration: MAX_RECORDING_DURATION,
    isProcessing,
    isFinishing,
    isIOS: isIOSRef.current,
    remainingTime,
    isCancelling,
  };
};
