import { useCountdownStore } from "@src/stores/countdownStore";
import { useEffect } from "react";

export const useCountdown = (initialTime: number, onComplete: () => void) => {
  const { timeLeft, isActive, startCountdown, setInitialTime, setOnComplete } = useCountdownStore();

  useEffect(() => {
    setInitialTime(initialTime);
    setOnComplete(onComplete);
  }, [initialTime, onComplete, setInitialTime, setOnComplete]);

  return { timeLeft, isActive, startCountdown };
};
