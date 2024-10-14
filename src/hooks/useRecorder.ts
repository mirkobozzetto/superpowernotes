import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { useAudioHandling } from "./_useRecorder/useAudioHandling";
import { useRecordingState } from "./_useRecorder/useRecordingState";
import { useServerCommunication } from "./_useRecorder/useServerCommunication";
import { useTimeManagement } from "./_useRecorder/useTimeManagement";

const MAX_RECORDING_DURATION = 120; // seconds
const CANCEL_DELAY = 500; // milliseconds

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

  const startRecording = async () => {
    if (isCancelling) return;
    if (remainingTime !== null && remainingTime <= 0) {
      setError("You have reached your time limit. Please contact support for more time.");
      return;
    }

    chunksRef.current = [];
    actualRecordingTimeRef.current = 0;

    try {
      await startAudioRecording(
        (event) => chunksRef.current.push(event.data),
        () => {
          if (chunksRef.current.length > 0 && actualRecordingTimeRef.current > 0) {
            sendAudioToServer(
              new Blob(chunksRef.current, { type: getAudioMimeType() }),
              actualRecordingTimeRef.current
            );
          }
        }
      );

      startTimeRef.current = Date.now();
      setIsRecording(true);
      setIsPaused(false);
      setError(null);
      setIsSuccess(false);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prevTime) => {
          const newTime = prevTime + 1;
          actualRecordingTimeRef.current = newTime;
          if (newTime >= MAX_RECORDING_DURATION - 1) {
            finishRecording();
            return MAX_RECORDING_DURATION;
          }
          return newTime;
        });
      }, 1000);
    } catch (error) {
      console.error("Error starting recording:", error);
      setError("Failed to start recording. Please check your microphone permissions.");
    }
  };

  const stopRecording = () => {
    stopAudioRecording();
    setIsRecording(false);
    setIsPaused(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    cleanupAudioResources();
  };

  const pauseResumeRecording = () => {
    if (isPaused) {
      resumeAudioRecording();
      setIsPaused(false);
      timerRef.current = setInterval(() => {
        setRecordingTime((prevTime) => {
          const newTime = prevTime + 1;
          actualRecordingTimeRef.current = newTime;
          return newTime;
        });
      }, 1000);
    } else {
      pauseAudioRecording();
      setIsPaused(true);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const cancelRecording = () => {
    setIsCancelling(true);
    stopAudioRecording();
    chunksRef.current = [];
    setIsRecording(false);
    setIsPaused(false);
    setError(null);
    setIsSuccess(false);
    setRecordingTime(0);
    actualRecordingTimeRef.current = 0;
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    cleanupAudioResources();
    setTimeout(() => {
      setIsProcessing(false);
      setIsCancelling(false);
    }, CANCEL_DELAY);
  };

  useEffect(() => {
    setIsProcessing(isFinishing);
  }, [isFinishing, setIsProcessing]);

  const finishRecording = async () => {
    setIsFinishing(true);
    stopRecording();
    if (chunksRef.current.length > 0 && actualRecordingTimeRef.current > 0) {
      try {
        await sendAudioToServer(
          new Blob(chunksRef.current, { type: getAudioMimeType() }),
          actualRecordingTimeRef.current
        );
      } catch (error) {
        console.error("Error sending audio to server:", error);
        setError("Failed to process recording. Please try again.");
      }
    }
    cleanupAudioResources();
    setIsFinishing(false);
    console.log("Exiting finishRecording");
  };

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
