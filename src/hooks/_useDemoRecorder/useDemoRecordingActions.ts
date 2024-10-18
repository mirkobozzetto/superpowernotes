import { COOLDOWN_TIME, MAX_DEMO_DURATION } from "@src/constants/demoConstants";
import { demoTranscriptionService } from "@src/services/demoTranscriptionService";
import { useCallback, useState } from "react";

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
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [demoResult, setDemoResult] = useState<{ transcription: string; tags: string[] } | null>(
    null
  );
  const [recordingTime, setRecordingTime] = useState(0);
  const [trialLimitReached, setTrialLimitReached] = useState(false);
  const [trialCount, setTrialCount] = useState(0);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [isCooldownActive, setIsCooldownActive] = useState(false);
  const [cooldownTimeLeft, setCooldownTimeLeft] = useState(COOLDOWN_TIME);
  const [chunks, setChunks] = useState<Blob[]>([]);
  const [shouldProcess, setShouldProcess] = useState(true);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  const startCountdown = useCallback(() => {
    setIsCooldownActive(true);
    setCooldownTimeLeft(COOLDOWN_TIME);
    const countdownInterval = setInterval(() => {
      setCooldownTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(countdownInterval);
          setIsCooldownActive(false);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  }, []);

  const handleCountdownComplete = useCallback(() => {
    setTrialLimitReached(false);
    setTrialCount(0);
    setShowLimitModal(false);
  }, []);

  const finishRecording = useCallback(async () => {
    stopAudioRecording();
    setIsRecording(false);
    setIsPaused(false);
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }

    if (chunks.length > 0 && shouldProcess && !trialLimitReached) {
      setIsProcessing(true);
      const audioBlob = new Blob(chunks, { type: getAudioMimeType() });

      try {
        const result = await demoTranscriptionService(audioBlob, recordingTime);
        setTrialCount((prevCount) => {
          const newCount = prevCount - 1;
          if (newCount <= 0) {
            setTrialLimitReached(true);
            startCountdown();
          }
          return newCount;
        });
        setDemoResult(result);
      } catch (error: unknown) {
        console.error("Error processing demo recording:", error);
        if (error instanceof Error && "status" in error && error.status === 429) {
          setTrialLimitReached(true);
          setError("Limite d'essais atteinte. Veuillez réessayer plus tard ou vous inscrire.");
        } else {
          setError("Échec du traitement de l'enregistrement. Veuillez réessayer.");
        }
      } finally {
        setIsProcessing(false);
      }
    }
    cleanupAudioResources();
    setShouldProcess(true);
  }, [
    chunks,
    shouldProcess,
    trialLimitReached,
    getAudioMimeType,
    recordingTime,
    stopAudioRecording,
    timer,
    cleanupAudioResources,
    startCountdown,
  ]);

  const startRecording = useCallback(async () => {
    if (trialLimitReached) {
      setError("Limite d'essais atteinte. Veuillez réessayer plus tard ou vous inscrire.");
      return;
    }

    setError(null);
    setDemoResult(null);
    setChunks([]);
    setRecordingTime(0);
    setShouldProcess(true);

    try {
      await startAudioRecording(
        (event) => setChunks((prevChunks) => [...prevChunks, event.data]),
        finishRecording,
        () => shouldProcess
      );

      setIsRecording(true);
      setIsPaused(false);

      const newTimer = setInterval(() => {
        setRecordingTime((prevTime) => {
          const newTime = prevTime + 1;
          if (newTime >= MAX_DEMO_DURATION) {
            finishRecording();
            return MAX_DEMO_DURATION;
          }
          return newTime;
        });
      }, 1000);

      setTimer(newTimer);
    } catch (error) {
      console.error("Error starting demo recording:", error);
      setError(
        "Échec du démarrage de l'enregistrement. Veuillez vérifier les permissions de votre microphone."
      );
    }
  }, [trialLimitReached, startAudioRecording, finishRecording, shouldProcess]);

  const stopRecording = useCallback(() => {
    finishRecording();
  }, [finishRecording]);

  const pauseResumeRecording = useCallback(() => {
    setIsPaused((prevIsPaused) => {
      if (prevIsPaused) {
        resumeRecording();
        const newTimer = setInterval(() => {
          setRecordingTime((prevTime) => prevTime + 1);
        }, 1000);
        setTimer(newTimer);
      } else {
        pauseRecording();
        if (timer) {
          clearInterval(timer);
          setTimer(null);
        }
      }
      return !prevIsPaused;
    });
  }, [pauseRecording, resumeRecording, timer]);

  const cancelRecording = useCallback(() => {
    setShouldProcess(false);
    stopAudioRecording();
    setChunks([]);
    setIsRecording(false);
    setIsPaused(false);
    setError(null);
    setDemoResult(null);
    setRecordingTime(0);
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
    cleanupAudioResources();
  }, [stopAudioRecording, cleanupAudioResources, timer]);

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
    finishRecording,
    startRecording,
    stopRecording,
    pauseResumeRecording,
    cancelRecording,
    startCountdown,
    handleCountdownComplete,
    setShowLimitModal,
  };
};
