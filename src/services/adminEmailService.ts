import { AdminEmailTemplate, EmailResult } from "@src/types/admin";

type SendEmailParams = {
  type: "subscribers" | "specific";
  userIds?: string[];
  template: AdminEmailTemplate;
};

export const adminEmailService = {
  async sendEmails({ type, userIds, template }: SendEmailParams): Promise<EmailResult[]> {
    const response = await fetch("/api/admin/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        type,
        userIds,
        template,
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data.result;
  },
};
