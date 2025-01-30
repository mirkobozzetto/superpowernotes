import { create } from "zustand";

type TrialManagementState = {
  showLimitModal: boolean;
  setShowLimitModal: (show: boolean) => void;
};

export const useTrialManagementStore = create<TrialManagementState>((set) => ({
  showLimitModal: false,
  setShowLimitModal: (show: boolean) => set({ showLimitModal: show }),
}));
