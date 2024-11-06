import { z } from "zod";

export const emailTemplateSchema = z.object({
  subject: z.string().min(1, "Le sujet est requis"),
  title: z.string().min(1, "Le titre est requis"),
  content: z.string().min(1, "Le contenu est requis"),
});

export const bulkEmailSchema = z.object({
  userEmails: z.array(z.string().email()).min(1).max(1000),
  template: emailTemplateSchema,
});

export const specificUsersSchema = z.object({
  userIds: z.array(z.string()).min(1).max(1000),
  template: emailTemplateSchema,
});
