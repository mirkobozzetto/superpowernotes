import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";

export const useTimeManagement = () => {
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const { data: session } = useSession();

  const fetchRemainingTime = useCallback(async () => {
    if (!session?.user?.id) return;
    try {
      const response = await fetch(`/api/users/${session.user.id}/usage`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setRemainingTime(data.currentPeriodRemainingTime);
    } catch (error) {
      console.error("Error fetching remaining time:", error);
      setRemainingTime(null);
    }
  }, [session]);

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
