export type AdminEmailTemplate = {
  subject: string;
  content: string;
};

export type EmailResult = {
  email: string;
  success: boolean;
  error: string | null;
};
