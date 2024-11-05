export type NewsletterStatus = "idle" | "loading" | "success" | "error";

export type NewsletterSubscription = {
  email: string;
  status: NewsletterStatus;
  error?: string;
};
