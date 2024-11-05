import { newsletterService } from "@src/services/newsletterService";
import { NewsletterStatus } from "@src/types/newsletter";
import { create } from "zustand";

interface NewsletterStore {
  email: string;
  status: NewsletterStatus;
  error: string | null;
  setEmail: (email: string) => void;
  subscribe: () => Promise<void>;
  reset: () => void;
}

export const useNewsletterStore = create<NewsletterStore>((set, get) => ({
  email: "",
  status: "idle",
  error: null,

  setEmail: (email) => set({ email }),

  subscribe: async () => {
    try {
      set({ status: "loading", error: null });
      await newsletterService.subscribe({ email: get().email });
      set({ status: "success", email: "" });
    } catch (error) {
      set({
        status: "error",
        error: error instanceof Error ? error.message : "Une erreur est survenue",
      });
    }
  },

  reset: () => set({ email: "", status: "idle", error: null }),
}));
