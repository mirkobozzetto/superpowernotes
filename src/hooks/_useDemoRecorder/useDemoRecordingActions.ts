import { MutableRefObject, useCallback } from "react";

type SetStateAction<T> = T | ((prevState: T) => T);
type Dispatch<A> = (value: A) => void;

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
  getAudioMimeType: () => string,
  chunksRef: MutableRefObject<Blob[]>,
  timerRef: MutableRefObject<NodeJS.Timeout | null>,
  shouldProcessRef: MutableRefObject<boolean>,
  setIsRecording: Dispatch<SetStateAction<boolean>>,
  setIsPaused: Dispatch<SetStateAction<boolean>>,
  setIsProcessing: Dispatch<SetStateAction<boolean>>,
  setError: Dispatch<SetStateAction<string | null>>,
  setDemoResult: Dispatch<SetStateAction<{ transcription: string; tags: string[] } | null>>,
  setRecordingTime: Dispatch<SetStateAction<number>>,
  trialLimitReached: boolean,
  setTrialLimitReached: Dispatch<SetStateAction<boolean>>,
  setTrialCount: Dispatch<SetStateAction<number>>,
  startCountdown: () => void,
  MAX_DEMO_DURATION: number
) => {
  const finishRecording = useCallback(async () => {
    stopAudioRecording();
    setIsRecording(false);
    setIsPaused(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    if (chunksRef.current.length > 0 && shouldProcessRef.current && !trialLimitReached) {
      setIsProcessing(true);
      const audioBlob = new Blob(chunksRef.current, { type: getAudioMimeType() });
      const formData = new FormData();

      const audioFile = new File([audioBlob], "demo_recording.webm", { type: getAudioMimeType() });
      formData.append("audio", audioFile);

      formData.append("duration", setRecordingTime.toString());

      try {
        const response = await fetch("/api/demo-transcribe", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          if (response.status === 429) {
            setTrialLimitReached(true);
            setError("Limite d'essais atteinte. Veuillez réessayer plus tard ou vous inscrire.");
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        } else {
          setTrialCount((prevCount) => {
            const newCount = prevCount + 1;
            if (newCount >= MAX_DEMO_DURATION) {
              setTrialLimitReached(true);
              startCountdown();
            }
            return newCount;
          });

          const data = await response.json();
          setDemoResult({
            transcription: data.transcription,
            tags: data.tags || [],
          });
        }
      } catch (error) {
        console.error("Error processing demo recording:", error);
        setError("Échec du traitement de l'enregistrement. Veuillez réessayer.");
      } finally {
        setIsProcessing(false);
      }
    }
    cleanupAudioResources();
    shouldProcessRef.current = true;
  }, [
    stopAudioRecording,
    setIsRecording,
    setIsPaused,
    timerRef,
    chunksRef,
    shouldProcessRef,
    trialLimitReached,
    getAudioMimeType,
    setRecordingTime,
    setIsProcessing,
    setTrialLimitReached,
    setError,
    setTrialCount,
    MAX_DEMO_DURATION,
    startCountdown,
    setDemoResult,
    cleanupAudioResources,
  ]);

  const startRecording = useCallback(async () => {
    if (trialLimitReached) {
      setError("Limite d'essais atteinte. Veuillez réessayer plus tard ou vous inscrire.");
      return;
    }
    setError(null);
    setDemoResult(null);
    chunksRef.current = [];
    setRecordingTime(0);
    shouldProcessRef.current = true;

    try {
      await startAudioRecording(
        (event) => chunksRef.current.push(event.data),
        finishRecording,
        () => shouldProcessRef.current
      );

      setIsRecording(true);
      setIsPaused(false);

      timerRef.current = setInterval(() => {
        setRecordingTime((prevTime) => {
          const newTime = prevTime + 1;
          if (newTime >= MAX_DEMO_DURATION) {
            finishRecording();
            return MAX_DEMO_DURATION;
          }
          return newTime;
        });
      }, 1000);
    } catch (error) {
      console.error("Error starting demo recording:", error);
      setError(
        "Échec du démarrage de l'enregistrement. Veuillez vérifier les permissions de votre microphone."
      );
    }
  }, [
    trialLimitReached,
    setError,
    setDemoResult,
    chunksRef,
    setRecordingTime,
    startAudioRecording,
    finishRecording,
    shouldProcessRef,
    setIsRecording,
    setIsPaused,
    timerRef,
    MAX_DEMO_DURATION,
  ]);

  const stopRecording = useCallback(() => {
    finishRecording();
  }, [finishRecording]);

  const pauseResumeRecording = useCallback(() => {
    setIsPaused((prevIsPaused) => {
      if (prevIsPaused) {
        resumeRecording();
        timerRef.current = setInterval(() => {
          setRecordingTime((prevTime) => prevTime + 1);
        }, 1000);
      } else {
        pauseRecording();
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      }
      return !prevIsPaused;
    });
  }, [pauseRecording, resumeRecording, setIsPaused, setRecordingTime, timerRef]);

  const cancelRecording = useCallback(() => {
    shouldProcessRef.current = false;
    stopAudioRecording();
    chunksRef.current = [];
    setIsRecording(false);
    setIsPaused(false);
    setError(null);
    setDemoResult(null);
    setRecordingTime(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    cleanupAudioResources();
  }, [
    stopAudioRecording,
    chunksRef,
    setIsRecording,
    setIsPaused,
    setError,
    setDemoResult,
    setRecordingTime,
    timerRef,
    cleanupAudioResources,
    shouldProcessRef,
  ]);

  return {
    finishRecording,
    startRecording,
    stopRecording,
    pauseResumeRecording,
    cancelRecording,
  };
};
