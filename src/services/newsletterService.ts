import { NewsletterSchema } from "@src/validations/newsletter";

export const newsletterService = {
  async subscribe(data: NewsletterSchema) {
    const response = await fetch("/api/newsletter/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error);
    }

    return result;
  },
};
