import { useRef, useState } from "react";

export const useDemoRecordingState = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [demoResult, setDemoResult] = useState<{ transcription: string; tags: string[] } | null>(
    null
  );
  const [recordingTime, setRecordingTime] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const shouldProcessRef = useRef(true);

  return {
    isRecording,
    setIsRecording,
    isPaused,
    setIsPaused,
    isProcessing,
    setIsProcessing,
    error,
    setError,
    demoResult,
    setDemoResult,
    recordingTime,
    setRecordingTime,
    timerRef,
    shouldProcessRef,
  };
};
