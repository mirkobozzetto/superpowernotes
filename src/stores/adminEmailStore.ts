import { adminEmailService } from "@src/services/adminEmailService";
import { EmailResult } from "@src/types/admin";
import { create } from "zustand";

type AdminEmailStore = {
  subject: string;
  title: string;
  content: string;
  sending: boolean;
  results: EmailResult[];
  setSubject: (subject: string) => void;
  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  sendEmails: (type: "subscribers" | "specific", userIds?: string[]) => Promise<void>;
  reset: () => void;
};

export const useAdminEmailStore = create<AdminEmailStore>((set, get) => ({
  subject: "",
  title: "",
  content: "",
  sending: false,
  results: [],

  setSubject: (subject) => set({ subject }),
  setTitle: (title) => set({ title }),
  setContent: (content) => set({ content }),

  sendEmails: async (type, userIds) => {
    const { subject, title, content } = get();
    set({ sending: true });

    try {
      const results = await adminEmailService.sendEmails({
        type,
        userIds,
        template: { subject, title, content },
      });

      set({ results, subject: "", title: "", content: "" });
    } catch (error) {
      throw error;
    } finally {
      set({ sending: false });
    }
  },

  reset: () => set({ subject: "", title: "", content: "", results: [], sending: false }),
}));
