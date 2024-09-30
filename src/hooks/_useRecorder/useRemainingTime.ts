import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";

export const useRemainingTime = () => {
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const { data: session } = useSession();

  const fetchRemainingTime = useCallback(async () => {
    if (session?.user?.id) {
      try {
        const response = await fetch("/api/users/credits");
        const data = await response.json();
        setRemainingTime(data.remainingSeconds);
      } catch (error) {
        console.error("Error fetching remaining time:", error);
      }
    }
  }, [session]);

  useEffect(() => {
    fetchRemainingTime();
    const intervalId = setInterval(fetchRemainingTime, 60000);
    return () => clearInterval(intervalId);
  }, [fetchRemainingTime]);

  return { remainingTime, fetchRemainingTime };
};
