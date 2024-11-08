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
    console.log("Template initial:", template);
    const validated = bulkEmailSchema.parse({ userEmails, template });
    console.log("Template validé:", validated.template);

    const fromEmail =
      process.env.NODE_ENV === "development" ? "onboarding@resend.dev" : "support@superpowernot.es";

    const results = await Promise.allSettled(
      validated.userEmails.map(async (email) => {
        try {
          console.log("Préparation email pour:", email, {
            subject: validated.template.subject,
            title: validated.template.title,
            content: validated.template.content.substring(0, 50) + "...",
          });

          const emailHtml = await render(
            AdminEmailTemplate({
              subject: validated.template.subject,
              title: validated.template.title || validated.template.subject, // Fallback si title manquant
              content: validated.template.content,
              unsubscribeUrl: `${APP_URL}/api/newsletter/unsubscribe/${email}`,
            })
          );

          console.log("Email HTML généré pour:", email);

          const result = await resend.emails.send({
            from: fromEmail,
            to: email,
            subject: validated.template.subject,
            html: emailHtml,
            ...(process.env.NODE_ENV === "development" && {
              headers: { "X-Environment": "development" },
            }),
          });

          console.log("Email envoyé à:", email, "Résultat:", result);
          return result;
        } catch (error) {
          console.error("Erreur envoi email à:", email, error);
          throw error;
        }
      })
    );

    const finalResults = results.map((result, index) => ({
      email: validated.userEmails[index],
      success: result.status === "fulfilled",
      error: result.status === "rejected" ? result.reason : null,
    }));

    console.log("Résultats finaux:", finalResults);
    return finalResults;
  },

  async sendToSubscribers(template: EmailTemplate) {
    console.log("Envoi aux abonnés. Template:", template);
    const validatedTemplate = emailTemplateSchema.parse(template);

    const subscribers = await prisma.user.findMany({
      where: { newsletterSubscribed: true },
      select: { email: true },
    });

    console.log("Nombre d'abonnés trouvés:", subscribers.length);
    return this.sendBulkEmail(
      subscribers.map((sub) => sub.email),
      validatedTemplate
    );
  },

  async sendToSpecificUsers(userIds: string[], template: EmailTemplate) {
    console.log("Envoi aux utilisateurs spécifiques. IDs:", userIds);
    const validated = specificUsersSchema.parse({ userIds, template });

    const users = await prisma.user.findMany({
      where: { id: { in: validated.userIds } },
      select: { email: true },
    });

    console.log("Nombre d'utilisateurs trouvés:", users.length);
    return this.sendBulkEmail(
      users.map((user) => user.email),
      validated.template
    );
  },
};
