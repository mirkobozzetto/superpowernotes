import { useCallback, useEffect, useState } from "react";

const MAX_TRIAL_COUNT = 5;
const STORAGE_KEY = "demoTrialCount";

export const useDemoTrialManagement = (isCooldownActive: boolean, startCountdown: () => void) => {
  const [trialCount, setTrialCount] = useState(() => {
    const savedCount = localStorage.getItem(STORAGE_KEY);
    return savedCount ? Math.min(parseInt(savedCount, 10), MAX_TRIAL_COUNT) : MAX_TRIAL_COUNT;
  });

  const [trialLimitReached, setTrialLimitReached] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);

  const handleCountdownComplete = useCallback(() => {
    setTrialCount(MAX_TRIAL_COUNT);
    setTrialLimitReached(false);
    localStorage.setItem(STORAGE_KEY, MAX_TRIAL_COUNT.toString());
    setShowLimitModal(false);
  }, []);

  useEffect(() => {
    const newTrialLimitReached = trialCount <= 0;
    setTrialLimitReached(newTrialLimitReached);
    localStorage.setItem(STORAGE_KEY, trialCount.toString());

    if (newTrialLimitReached && !isCooldownActive) {
      startCountdown();
      setShowLimitModal(true);
    }
  }, [trialCount, isCooldownActive, startCountdown]);

  const decrementTrialCount = useCallback(() => {
    setTrialCount((prevCount) => Math.max(0, prevCount - 1));
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
