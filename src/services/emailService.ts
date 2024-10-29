import { prisma } from "@src/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.AUTH_RESEND_KEY);

export type EmailTemplate = {
  subject: string;
  content: string;
};

export const emailService = {
  async sendBulkEmail(userEmails: string[], template: EmailTemplate) {
    console.log("Starting sendBulkEmail with:", {
      numberOfEmails: userEmails.length,
      template: template,
    });

    const fromEmail =
      process.env.NODE_ENV === "development" ? "onboarding@resend.dev" : "support@superpowernot.es";

    console.log("Sending from:", fromEmail);

    try {
      const results = await Promise.allSettled(
        userEmails.map(async (email) => {
          console.log("Attempting to send to:", email);
          try {
            const result = await resend.emails.send({
              from: fromEmail,
              to: email,
              subject: template.subject,
              text: template.content,
              ...(process.env.NODE_ENV === "development" && {
                headers: {
                  "X-Environment": "development",
                },
              }),
            });
            console.log("Resend result for", email, ":", result);
            return result;
          } catch (error) {
            console.error("Failed sending to", email, ":", error);
            throw error;
          }
        })
      );

      console.log("All send attempts completed:", results);

      return results.map((result, index) => ({
        email: userEmails[index],
        success: result.status === "fulfilled",
        error: result.status === "rejected" ? result.reason : null,
      }));
    } catch (error) {
      console.error("Bulk send error:", error);
      throw error;
    }
  },

  async sendToSubscribers(template: EmailTemplate) {
    console.log("Starting sendToSubscribers...");

    const subscribers = await prisma.user.findMany({
      where: {
        newsletterSubscribed: true,
      },
      select: {
        email: true,
      },
    });

    console.log("Found subscribers:", subscribers.length);

    const subscriberEmails = subscribers.map((sub) => sub.email);
    console.log("Emails to send to:", subscriberEmails);

    return this.sendBulkEmail(subscriberEmails, template);
  },

  async sendToSpecificUsers(userIds: string[], template: EmailTemplate) {
    console.log("Starting sendToSpecificUsers...");

    const users = await prisma.user.findMany({
      where: {
        id: { in: userIds },
      },
      select: {
        email: true,
      },
    });

    console.log("Found users:", users.length);

    const userEmails = users.map((user) => user.email);
    console.log("Emails to send to:", userEmails);

    return this.sendBulkEmail(userEmails, template);
  },
};
