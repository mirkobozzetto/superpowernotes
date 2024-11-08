import { z } from "zod";

export const EmailTemplateSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  content: z.string().min(1, "Content is required"),
});

export const AdminEmailSchema = z
  .object({
    userIds: z.array(z.string()).optional(),
    template: EmailTemplateSchema,
    type: z.enum(["subscribers", "specific"]),
  })
  .refine(
    (data) => {
      if (data.type === "specific") {
        return Array.isArray(data.userIds) && data.userIds.length > 0;
      }
      return true;
    },
    {
      message: "UserIds are required when type is 'specific'",
    }
  );

export type AdminEmailRequest = z.infer<typeof AdminEmailSchema>;
export type EmailTemplate = z.infer<typeof EmailTemplateSchema>;
