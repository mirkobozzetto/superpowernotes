import { z } from "zod";

export const emailRecipientsSchema = z.object({
  includeSubscribers: z.boolean(),
  includeUsers: z.boolean(),
  selectedUsers: z.array(z.string()).optional(),
});

export const adminEmailSchema = z.object({
  subject: z.string().min(1, "Le sujet est requis"),
  title: z.string().min(1, "Le titre est requis"),
  content: z.string().min(1, "Le contenu est requis"),
  type: z.enum(["subscribers", "specific"]).optional(),
  userIds: z.array(z.string()).optional(),
});
