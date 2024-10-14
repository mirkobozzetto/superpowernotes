import { useCallback, useEffect, useRef, useState } from "react";
import { useDemoAudioHandling } from "./_useDemoRecorder/useDemoAudioHandling";

const MAX_DEMO_DURATION = 30;
const MAX_TRIAL_COUNT = 2;
const STORAGE_KEY = "demoTrialCount";

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

  const [trialCount, setTrialCount] = useState(() => {
    const savedCount = localStorage.getItem(STORAGE_KEY);
    return savedCount ? Math.min(parseInt(savedCount, 10), MAX_TRIAL_COUNT) : 0;
  });

  const [trialLimitReached, setTrialLimitReached] = useState(() => trialCount >= MAX_TRIAL_COUNT);
  const [showLimitModal, setShowLimitModal] = useState(false);

  const shouldProcessRef = useRef(true);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [demoResult, setDemoResult] = useState<{ transcription: string; tags: string[] } | null>(
    null
  );
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, trialCount.toString());
    setTrialLimitReached(trialCount >= MAX_TRIAL_COUNT);
  }, [trialCount]);

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
      formData.append("audio", audioBlob, "demo_recording.webm");
      formData.append("duration", recordingTime.toString());

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
          setTrialCount((prevCount) => Math.min(prevCount + 1, MAX_TRIAL_COUNT));
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
    chunksRef,
    cleanupAudioResources,
    getAudioMimeType,
    recordingTime,
    trialLimitReached,
  ]);

  const startRecording = useCallback(async () => {
    if (trialLimitReached) {
      setShowLimitModal(true);
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
  }, [startAudioRecording, finishRecording, chunksRef, trialLimitReached]);

  const stopRecording = useCallback(() => {
    finishRecording();
  }, [finishRecording]);

  const pauseResumeRecording = useCallback(() => {
    if (isPaused) {
      resumeRecording();
      setIsPaused(false);
      timerRef.current = setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      pauseRecording();
      setIsPaused(true);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  }, [isPaused, resumeRecording, pauseRecording]);

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
  }, [stopAudioRecording, chunksRef, cleanupAudioResources]);

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
    finishRecording,
    cancelRecording,
    trialLimitReached,
    trialCount,
    showLimitModal,
    setShowLimitModal,
  };
};
