import { useState } from "react";

export const useRecordingState = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  return {
    isRecording,
    setIsRecording,
    isPaused,
    setIsPaused,
    error,
    setError,
    isSuccess,
    setIsSuccess,
    recordingTime,
    setRecordingTime,
    isProcessing,
    setIsProcessing,
  };
};
