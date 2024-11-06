import { adminEmailSchema } from "@src/lib/validations/admin";
import { useAdminEmailStore } from "@src/stores/adminEmailStore";
import { useCallback } from "react";

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
    async (type: "subscribers" | "specific") => {
      try {
        adminEmailSchema.parse({
          subject,
          title,
          content,
          type,
          userIds: selectedUsers,
        });

        await sendEmails(type, selectedUsers);
      } catch (error) {
        console.error("Email validation error:", error);
        throw error;
      }
    },
    [subject, title, content, selectedUsers, sendEmails]
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
