import { useCallback, useEffect, useState } from "react";

export const useTimeManagement = () => {
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);

  const fetchRemainingTime = useCallback(async () => {
    try {
      const response = await fetch("/api/voice-notes");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setRemainingTime(data.remainingTime);
    } catch (error) {
      console.error("Error fetching remaining time:", error);
      setRemainingTime(null);
    }
  }, []);

  useEffect(() => {
    fetchRemainingTime();
  }, [fetchRemainingTime]);

  return {
    remainingTime,
    setRemainingTime,
    recordingTime,
    setRecordingTime,
    fetchRemainingTime,
  };
};
