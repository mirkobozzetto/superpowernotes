import {
  CANCEL_DELAY,
  MAX_RECORDING_DURATION,
  RECORDING_COMPLETE_EVENT,
} from "@src/constants/recorderConstants";
import { useRecordingActionsStore } from "@src/stores/recordingActionsStore";
import { useCallback } from "react";

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
  const store = useRecordingActionsStore();

  const finishRecording = useCallback(async () => {
    console.log("Starting finishRecording");
    setIsFinishing(true);
    store.setIsFinishing(true);
    stopAudioRecording();

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

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
        store.setError("Failed to process recording. Please try again.");
      }
    }

    cleanupAudioResources();
    setIsFinishing(false);
    store.setIsFinishing(false);
    setIsRecording(false);
    store.setIsRecording(false);
    setRecordingTime(0);
    store.setRecordingTime(0);
    console.log("Exiting finishRecording");
  }, [
    setIsFinishing,
    stopAudioRecording,
    timerRef,
    chunksRef,
    actualRecordingTimeRef,
    cleanupAudioResources,
    setIsRecording,
    setRecordingTime,
    sendAudioToServer,
    getAudioMimeType,
    setError,
    store,
  ]);

  const startRecording = useCallback(async () => {
    if (isCancelling) return;
    if (remainingTime !== null && remainingTime <= 0) {
      setError("You have reached your time limit. Please contact support for more time.");
      store.setError("You have reached your time limit. Please contact support for more time.");
      return;
    }

    chunksRef.current = [];
    store.clearChunks();
    actualRecordingTimeRef.current = 0;
    store.resetActualRecordingTime();

    try {
      await startAudioRecording(
        (event: BlobEvent) => {
          chunksRef.current.push(event.data);
          store.addChunk(event.data);
        },
        () => {
          if (chunksRef.current.length > 0 && actualRecordingTimeRef.current > 0) {
            finishRecording();
          }
        }
      );

      startTimeRef.current = Date.now();
      store.setStartTime(Date.now());
      setIsRecording(true);
      store.setIsRecording(true);
      setIsPaused(false);
      store.setIsPaused(false);
      setError(null);
      store.setError(null);
      setIsSuccess(false);
      store.setIsSuccess(false);
      setRecordingTime(0);
      store.setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prevTime: number) => {
          const newTime = prevTime + 1;
          actualRecordingTimeRef.current = newTime;
          store.incrementActualRecordingTime();
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
      store.setError("Failed to start recording. Please check your microphone permissions.");
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
    store,
  ]);

  const stopRecording = useCallback(() => {
    stopAudioRecording();
    setIsRecording(false);
    store.setIsRecording(false);
    setIsPaused(false);
    store.setIsPaused(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    cleanupAudioResources();
  }, [stopAudioRecording, setIsRecording, setIsPaused, cleanupAudioResources, timerRef, store]);

  const pauseResumeRecording = useCallback(() => {
    setIsPaused((prevIsPaused: boolean) => {
      const newIsPaused = !prevIsPaused;
      store.setIsPaused(newIsPaused);
      if (newIsPaused) {
        pauseAudioRecording();
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      } else {
        resumeAudioRecording();
        timerRef.current = setInterval(() => {
          setRecordingTime((prevTime: number) => {
            const newTime = prevTime + 1;
            actualRecordingTimeRef.current = newTime;
            store.incrementActualRecordingTime();
            return newTime;
          });
        }, 1000);
      }
      return newIsPaused;
    });
  }, [
    pauseAudioRecording,
    resumeAudioRecording,
    setIsPaused,
    setRecordingTime,
    timerRef,
    actualRecordingTimeRef,
    store,
  ]);

  const cancelRecording = useCallback(() => {
    setIsCancelling(true);
    store.setIsCancelling(true);
    stopRecording();
    chunksRef.current = [];
    store.clearChunks();
    setIsRecording(false);
    store.setIsRecording(false);
    setIsPaused(false);
    store.setIsPaused(false);
    setError(null);
    store.setError(null);
    setIsSuccess(false);
    store.setIsSuccess(false);
    setRecordingTime(0);
    store.setRecordingTime(0);
    actualRecordingTimeRef.current = 0;
    store.resetActualRecordingTime();
    setTimeout(() => {
      setIsProcessing(false);
      store.setIsProcessing(false);
      setIsCancelling(false);
      store.setIsCancelling(false);
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
    store,
  ]);

  return {
    finishRecording,
    startRecording,
    stopRecording,
    pauseResumeRecording,
    cancelRecording,
  };
};
