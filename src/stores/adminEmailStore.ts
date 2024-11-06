import { adminEmailService } from "@src/services/adminEmailService";
import { EmailResult } from "@src/types/admin";
import { create } from "zustand";

type AdminEmailStore = {
  subject: string;
  content: string;
  sending: boolean;
  results: EmailResult[];
  setSubject: (subject: string) => void;
  setContent: (content: string) => void;
  sendEmails: (type: "subscribers" | "specific", userIds?: string[]) => Promise<void>;
  reset: () => void;
};

export const useAdminEmailStore = create<AdminEmailStore>((set, get) => ({
  subject: "",
  content: "",
  sending: false,
  results: [],

  setSubject: (subject) => set({ subject }),
  setContent: (content) => set({ content }),

  sendEmails: async (type, userIds) => {
    const { subject, content } = get();
    set({ sending: true });

    try {
      const results = await adminEmailService.sendEmails({
        type,
        userIds,
        template: { subject, content },
      });

      set({ results, subject: "", content: "" });
    } catch (error) {
      throw error;
    } finally {
      set({ sending: false });
    }
  },

  reset: () => set({ subject: "", content: "", results: [], sending: false }),
}));
