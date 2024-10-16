import { useCallback } from "react";

const MAX_RECORDING_DURATION = 120; // seconds
const CANCEL_DELAY = 500; // milliseconds
const RECORDING_COMPLETE_EVENT = "recordingComplete";

export const useRecordingActions = (
  isCancelling: boolean,
  remainingTime: number | null,
  startAudioRecording: Function,
  stopAudioRecording: Function,
  pauseAudioRecording: Function,
  resumeAudioRecording: Function,
  getAudioMimeType: Function,
  cleanupAudioResources: Function,
  sendAudioToServer: Function,
  setError: Function,
  setIsRecording: Function,
  setIsPaused: Function,
  setIsSuccess: Function,
  setRecordingTime: Function,
  setIsProcessing: Function,
  setIsFinishing: Function,
  setIsCancelling: Function,
  chunksRef: React.MutableRefObject<Blob[]>,
  startTimeRef: React.MutableRefObject<number | null>,
  timerRef: React.MutableRefObject<NodeJS.Timeout | null>,
  actualRecordingTimeRef: React.MutableRefObject<number>
) => {
  const finishRecording = useCallback(async () => {
    console.log("Starting finishRecording");
    setIsFinishing(true);
    stopAudioRecording();
    if (chunksRef.current.length > 0 && actualRecordingTimeRef.current > 0) {
      try {
        console.log("Sending audio to server");
        await sendAudioToServer(
          new Blob(chunksRef.current, { type: getAudioMimeType() }),
          actualRecordingTimeRef.current
        );
        console.log("Audio sent successfully, dispatching event");
        window.dispatchEvent(new Event(RECORDING_COMPLETE_EVENT));
      } catch (error) {
        console.error("Error sending audio to server:", error);
        setError("Failed to process recording. Please try again.");
      }
    }
    cleanupAudioResources();
    setIsFinishing(false);
    console.log("Exiting finishRecording");
  }, [
    stopAudioRecording,
    getAudioMimeType,
    sendAudioToServer,
    cleanupAudioResources,
    setError,
    setIsFinishing,
    chunksRef,
    actualRecordingTimeRef,
  ]);

  const startRecording = useCallback(async () => {
    if (isCancelling) return;
    if (remainingTime !== null && remainingTime <= 0) {
      setError("You have reached your time limit. Please contact support for more time.");
      return;
    }

    chunksRef.current = [];
    actualRecordingTimeRef.current = 0;

    try {
      await startAudioRecording(
        (event: BlobEvent) => chunksRef.current.push(event.data),
        () => {
          if (chunksRef.current.length > 0 && actualRecordingTimeRef.current > 0) {
            finishRecording();
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
        setRecordingTime((prevTime: number) => {
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
  }, [
    isCancelling,
    remainingTime,
    startAudioRecording,
    setIsRecording,
    setIsPaused,
    setError,
    setIsSuccess,
    setRecordingTime,
    finishRecording,
    chunksRef,
    startTimeRef,
    timerRef,
    actualRecordingTimeRef,
  ]);

  const stopRecording = useCallback(() => {
    stopAudioRecording();
    setIsRecording(false);
    setIsPaused(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    cleanupAudioResources();
  }, [stopAudioRecording, setIsRecording, setIsPaused, cleanupAudioResources, timerRef]);

  const pauseResumeRecording = useCallback(() => {
    setIsPaused((prevIsPaused: boolean) => {
      if (prevIsPaused) {
        resumeAudioRecording();
        timerRef.current = setInterval(() => {
          setRecordingTime((prevTime: number) => {
            const newTime = prevTime + 1;
            actualRecordingTimeRef.current = newTime;
            return newTime;
          });
        }, 1000);
      } else {
        pauseAudioRecording();
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      }
      return !prevIsPaused;
    });
  }, [
    pauseAudioRecording,
    resumeAudioRecording,
    setIsPaused,
    setRecordingTime,
    timerRef,
    actualRecordingTimeRef,
  ]);

  const cancelRecording = useCallback(() => {
    setIsCancelling(true);
    stopRecording();
    chunksRef.current = [];
    setIsRecording(false);
    setIsPaused(false);
    setError(null);
    setIsSuccess(false);
    setRecordingTime(0);
    actualRecordingTimeRef.current = 0;
    setTimeout(() => {
      setIsProcessing(false);
      setIsCancelling(false);
    }, CANCEL_DELAY);
  }, [
    stopRecording,
    setIsRecording,
    setIsPaused,
    setError,
    setIsSuccess,
    setRecordingTime,
    setIsProcessing,
    setIsCancelling,
    chunksRef,
    actualRecordingTimeRef,
  ]);

  return {
    finishRecording,
    startRecording,
    stopRecording,
    pauseResumeRecording,
    cancelRecording,
  };
};
