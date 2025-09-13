import {
  CANCEL_DELAY,
  MAX_RECORDING_DURATION,
  RECORDING_COMPLETE_EVENT,
} from "@src/constants/recorderConstants";
import { useAudioHandlingStore } from "@src/stores/audioHandlingStore";
import { useRecordingActionsStore } from "@src/stores/recordingActionsStore";
import { useCallback, useRef } from "react";
import { useIOSDebounce } from "./useIOSDebounce";

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
  timerRef: React.MutableRefObject<ReturnType<typeof setTimeout> | null>,
  actualRecordingTimeRef: React.MutableRefObject<number>
) => {
  const store = useRecordingActionsStore();
  const isIOS = useAudioHandlingStore((state) => state.isIOS);
  const debounce = useIOSDebounce(3000);
  const isFinishingRef = useRef(false);

  const finishRecording = useCallback(async () => {
    if (isFinishingRef.current) {
      console.log("Recording finish in progress, skipping duplicate call");
      return;
    }

    console.log("Starting finishRecording");
    isFinishingRef.current = true;
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
        if (!isIOS) {
          await sendAudioToServer(
            new Blob(chunksRef.current, { type: getAudioMimeType() }),
            actualRecordingTimeRef.current
          );
          console.log("Audio sent successfully, dispatching event");
          window.dispatchEvent(new Event(RECORDING_COMPLETE_EVENT));
        }
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
    isFinishingRef.current = false;
    console.log("Exiting finishRecording");
  }, [
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
    isIOS,
    setIsFinishing,
  ]);

  const startRecording = useCallback(async () => {
    if (isCancelling) return;
    if (remainingTime !== null && remainingTime <= 0) {
      const errorMessage =
        "You have reached your time limit. Please contact support for more time.";
      setError(errorMessage);
      store.setError(errorMessage);
      return;
    }

    chunksRef.current = [];
    store.clearChunks();
    actualRecordingTimeRef.current = 0;
    store.resetActualRecordingTime();

    try {
      await startAudioRecording(
        async (event: BlobEvent) => {
          chunksRef.current.push(event.data);
          store.addChunk(event.data);

          if (isIOS && event.data.size > 0) {
            await debounce(async () => {
              try {
                await sendAudioToServer(event.data, actualRecordingTimeRef.current);
              } catch (error) {
                console.error("Error sending iOS audio chunk:", error);
                setError("Failed to process recording chunk. Please try again.");
              }
            });
          }
        },
        () => {
          if (chunksRef.current.length > 0 && actualRecordingTimeRef.current > 0) {
            finishRecording();
          }
        }
      );

      const currentTime = Date.now();
      startTimeRef.current = currentTime;
      store.setStartTime(currentTime);
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
    isIOS,
    debounce,
    sendAudioToServer,
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
    if (isIOS) return;

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
    isIOS,
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
