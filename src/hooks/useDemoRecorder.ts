import { useCallback, useRef, useState } from "react";
import { useDemoAudioHandling } from "./_useDemoRecorder/useDemoAudioHandling";

const MAX_DEMO_DURATION = 30;

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

  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [demoResult, setDemoResult] = useState<{ transcription: string; tags: string[] } | null>(
    null
  );
  const [recordingTime, setRecordingTime] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const finishRecording = useCallback(async () => {
    stopAudioRecording();
    setIsRecording(false);
    setIsPaused(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (chunksRef.current.length > 0) {
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
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setDemoResult({
          transcription: data.transcription,
          tags: data.tags,
        });
      } catch (error) {
        console.error("Error processing demo recording:", error);
        setError("Failed to process the recording. Please try again.");
      } finally {
        setIsProcessing(false);
      }
    }
    cleanupAudioResources();
  }, [stopAudioRecording, chunksRef, getAudioMimeType, recordingTime, cleanupAudioResources]);

  const startRecording = useCallback(async () => {
    setError(null);
    setDemoResult(null);
    chunksRef.current = [];
    setRecordingTime(0);

    try {
      await startAudioRecording((event) => chunksRef.current.push(event.data), finishRecording);

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
      setError("Failed to start recording. Please check your microphone permissions.");
    }
  }, [startAudioRecording, chunksRef, finishRecording]);

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
  };
};
