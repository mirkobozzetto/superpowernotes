import { create } from "zustand";

interface CountdownState {
  timeLeft: number;
  isActive: boolean;
  initialTime: number;
  onComplete: () => void;
  startCountdown: () => void;
  stopCountdown: () => void;
  resetCountdown: () => void;
  setInitialTime: (time: number) => void;
  setOnComplete: (callback: () => void) => void;
}

export const useCountdownStore = create<CountdownState>((set, get) => ({
  timeLeft: 0,
  isActive: false,
  initialTime: 0,
  onComplete: () => {},

  startCountdown: () => {
    set({ isActive: true });
    const interval = setInterval(() => {
      set((state) => {
        if (state.timeLeft <= 1) {
          clearInterval(interval);
          state.onComplete();
          return { timeLeft: 0, isActive: false };
        }
        return { timeLeft: state.timeLeft - 1 };
      });
    }, 1000);
  },

  stopCountdown: () => set({ isActive: false }),

  resetCountdown: () => set((state) => ({ timeLeft: state.initialTime, isActive: false })),

  setInitialTime: (time: number) => set({ initialTime: time, timeLeft: time }),

  setOnComplete: (callback: () => void) => set({ onComplete: callback }),
}));
