import { COOLDOWN_TIME } from "@src/constants/demoConstants";
import { create } from "zustand";

type TrialManagementState = {
  trialLimitReached: boolean;
  trialCount: number;
  showLimitModal: boolean;
  isCooldownActive: boolean;
  cooldownTimeLeft: number;
  setTrialLimitReached: (reached: boolean) => void;
  decrementTrialCount: () => void;
  setShowLimitModal: (show: boolean) => void;
  handleCountdownComplete: () => void;
  startCountdown: () => void;
  setInitialTime: (time: number) => void;
};

export const useTrialManagementStore = create<TrialManagementState>((set, get) => ({
  trialLimitReached: false,
  trialCount: 0,
  showLimitModal: false,
  isCooldownActive: false,
  cooldownTimeLeft: COOLDOWN_TIME,
  setTrialLimitReached: (reached) => set({ trialLimitReached: reached }),
  decrementTrialCount: () =>
    set((state) => {
      const newCount = state.trialCount - 1;
      if (newCount <= 0) {
        return { trialCount: 0, trialLimitReached: true };
      }
      return { trialCount: newCount };
    }),
  setShowLimitModal: (show) => set({ showLimitModal: show }),
  handleCountdownComplete: () =>
    set({
      trialLimitReached: false,
      trialCount: 0,
      showLimitModal: false,
      isCooldownActive: false,
    }),
  startCountdown: () => {
    set({ isCooldownActive: true, cooldownTimeLeft: COOLDOWN_TIME });
    const countdownInterval = setInterval(() => {
      set((state) => {
        if (state.cooldownTimeLeft <= 1) {
          clearInterval(countdownInterval);
          return { cooldownTimeLeft: 0, isCooldownActive: false };
        }
        return { cooldownTimeLeft: state.cooldownTimeLeft - 1 };
      });
    }, 1000);
  },
  setInitialTime: (time) => set({ cooldownTimeLeft: time }),
}));
