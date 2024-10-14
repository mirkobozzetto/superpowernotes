import { useEffect, useState } from "react";

export const useCountdown = (initialTime: number, onComplete: () => void) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      onComplete();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, onComplete]);

  const startCountdown = () => setIsActive(true);
  const stopCountdown = () => setIsActive(false);
  const resetCountdown = () => setTimeLeft(initialTime);

  return { timeLeft, isActive, startCountdown, stopCountdown, resetCountdown };
};
