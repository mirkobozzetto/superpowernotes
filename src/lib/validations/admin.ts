import { z } from "zod";

export const adminEmailSchema = z.object({
  subject: z.string().min(1, "Le sujet est requis"),
  content: z.string().min(1, "Le contenu est requis"),
  type: z.enum(["subscribers", "specific"]),
  userIds: z.array(z.string()).optional(),
});
