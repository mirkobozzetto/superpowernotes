import { useNewsletterStore } from "@src/stores/newsletterStore";
import { newsletterSchema } from "@src/validations/newsletter";
import { useCallback } from "react";

export const useNewsletter = () => {
  const { email, status, error, setEmail, subscribe, reset } = useNewsletterStore();

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      try {
        newsletterSchema.parse({ email });
        await subscribe();
      } catch (error) {
        if (error instanceof Error) {
          setEmail("");
          reset();
        }
      }
    },
    [email, subscribe, setEmail, reset]
  );

  return {
    email,
    status,
    error,
    setEmail,
    handleSubmit,
  };
};
