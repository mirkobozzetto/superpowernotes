import { userService } from "@src/services/userService";
import { create } from "zustand";

type TimeManagementState = {
  remainingTime: number | null;
  recordingTime: number;
  setRemainingTime: (time: number | null) => void;
  setRecordingTime: (time: number | ((prev: number) => number)) => void;
  fetchRemainingTime: (userId: string) => Promise<void>;
  updateRemainingTime: (duration: number) => void;
};

export const useTimeManagementStore = create<TimeManagementState>((set) => ({
  remainingTime: null,
  recordingTime: 0,

  setRemainingTime: (time) => set({ remainingTime: time }),

  setRecordingTime: (time) =>
    set((state) => ({
      recordingTime: typeof time === "function" ? time(state.recordingTime) : time,
    })),

  fetchRemainingTime: async (userId) => {
    try {
      const time = await userService.fetchRemainingTimeForUser(userId);
      set({ remainingTime: time });
    } catch (error) {
      console.error("Error fetching remaining time:", error);
      set({ remainingTime: null });
    }
  },

  updateRemainingTime: (duration) => {
    set((state) => ({
      remainingTime:
        state.remainingTime !== null ? Math.max(0, state.remainingTime - duration) : null,
    }));
  },
}));
