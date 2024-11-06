import { adminEmailSchema } from "@src/lib/validations/admin";
import { useAdminEmailStore } from "@src/stores/adminEmailStore";
import { useCallback } from "react";

type SendConfig = {
  includeSubscribers: boolean;
  includeUsers: boolean;
  selectedUsers?: string[];
};

export const useAdminEmail = (selectedUsers?: string[]) => {
  const {
    subject,
    title,
    content,
    sending,
    results,
    setSubject,
    setTitle,
    setContent,
    sendEmails,
    reset,
  } = useAdminEmailStore();

  const handleSend = useCallback(
    async ({ includeSubscribers, includeUsers, selectedUsers: selected }: SendConfig) => {
      try {
        adminEmailSchema.parse({
          subject,
          title,
          content,
          type: selected ? "specific" : "subscribers",
          userIds: selected,
        });

        const type = selected ? "specific" : "subscribers";
        await sendEmails(type, selected);
      } catch (error) {
        console.error("Email validation error:", error);
        throw error;
      }
    },
    [subject, title, content, sendEmails]
  );

  return {
    subject,
    title,
    content,
    sending,
    results,
    setSubject,
    setTitle,
    setContent,
    handleSend,
    reset,
  };
};
