import AdminEmailTemplate from "@email/emails/AdminEmailTemplate";
import { render } from "@react-email/render";
import { prisma } from "@src/lib/prisma";
import { bulkEmailSchema, emailTemplateSchema, specificUsersSchema } from "@src/validations/email";
import { Resend } from "resend";
import { z } from "zod";

const resend = new Resend(process.env.AUTH_RESEND_KEY);
const APP_URL =
  process.env.NODE_ENV === "production" ? "https://www.superpowernot.es" : "http://localhost:3000";

export type EmailTemplate = z.infer<typeof emailTemplateSchema>;

export const emailService = {
  async sendBulkEmail(userEmails: string[], template: EmailTemplate) {
    const validated = bulkEmailSchema.parse({ userEmails, template });

    const fromEmail =
      process.env.NODE_ENV === "development" ? "onboarding@resend.dev" : "support@superpowernot.es";

    const results = await Promise.allSettled(
      validated.userEmails.map(async (email) => {
        try {
          const emailHtml = await render(
            AdminEmailTemplate({
              subject: validated.template.subject,
              title: validated.template.title || validated.template.subject, // Fallback si title manquant
              content: validated.template.content,
              unsubscribeUrl: `${APP_URL}/api/newsletter/unsubscribe/${email}`,
            })
          );

          const result = await resend.emails.send({
            from: fromEmail,
            to: email,
            subject: validated.template.subject,
            html: emailHtml,
            ...(process.env.NODE_ENV === "development" && {
              headers: { "X-Environment": "development" },
            }),
          });

          return result;
        } catch (error) {
          throw error;
        }
      })
    );

    const finalResults = results.map((result, index) => ({
      email: validated.userEmails[index],
      success: result.status === "fulfilled",
      error: result.status === "rejected" ? result.reason : null,
    }));

    const failedCount = finalResults.filter((r) => !r.success).length;

    return { results: finalResults, failedCount, totalCount: finalResults.length };
  },

  async sendToSubscribers(template: EmailTemplate) {
    const validatedTemplate = emailTemplateSchema.parse(template);

    const subscribers = await prisma.user.findMany({
      where: { newsletterSubscribed: true },
      select: { email: true },
    });

    return this.sendBulkEmail(
      subscribers.map((sub) => sub.email),
      validatedTemplate
    );
  },

  async sendToSpecificUsers(userIds: string[], template: EmailTemplate) {
    const validated = specificUsersSchema.parse({ userIds, template });

    const users = await prisma.user.findMany({
      where: { id: { in: validated.userIds } },
      select: { email: true },
    });

    return this.sendBulkEmail(
      users.map((user) => user.email),
      validated.template
    );
  },
};
