import { MAX_TRIAL_COUNT, STORAGE_KEY } from "@src/constants/demoConstants";
import { useCallback, useEffect, useState } from "react";

const isClient = typeof window !== "undefined";

const safeLocalStorage = {
  getItem: (key: string): string | null => (isClient ? localStorage.getItem(key) : null),
  setItem: (key: string, value: string): void => {
    if (isClient) localStorage.setItem(key, value);
  },
};

export const useDemoTrialManagement = (isCooldownActive: boolean, startCountdown: () => void) => {
  const [trialCount, setTrialCount] = useState(MAX_TRIAL_COUNT);
  const [trialLimitReached, setTrialLimitReached] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);

  useEffect(() => {
    const savedCount = safeLocalStorage.getItem(STORAGE_KEY);
    if (savedCount !== null) {
      setTrialCount(Math.min(parseInt(savedCount, 10), MAX_TRIAL_COUNT));
    }
  }, []);

  const handleCountdownComplete = useCallback(() => {
    setTrialCount(MAX_TRIAL_COUNT);
    setTrialLimitReached(false);
    safeLocalStorage.setItem(STORAGE_KEY, MAX_TRIAL_COUNT.toString());
    setShowLimitModal(false);
  }, []);

  useEffect(() => {
    const newTrialLimitReached = trialCount <= 0;
    setTrialLimitReached(newTrialLimitReached);
    safeLocalStorage.setItem(STORAGE_KEY, trialCount.toString());

    if (newTrialLimitReached && !isCooldownActive) {
      startCountdown();
      setShowLimitModal(true);
    }
  }, [trialCount, isCooldownActive, startCountdown]);

  const decrementTrialCount = useCallback(() => {
    setTrialCount((prevCount) => {
      const newCount = Math.max(0, prevCount - 1);
      safeLocalStorage.setItem(STORAGE_KEY, newCount.toString());
      return newCount;
    });
  }, []);

  return {
    trialCount,
    setTrialCount,
    decrementTrialCount,
    trialLimitReached,
    setTrialLimitReached,
    showLimitModal,
    setShowLimitModal,
    handleCountdownComplete,
  };
};
