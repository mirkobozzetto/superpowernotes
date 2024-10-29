import { prisma } from "@src/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export type EmailTemplate = {
  subject: string;
  content: string;
};

export const emailService = {
  async sendBulkEmail(userEmails: string[], template: EmailTemplate) {
    const results = await Promise.allSettled(
      userEmails.map((email) =>
        resend.emails.send({
          from: "support@superpowernot.es",
          to: email,
          subject: template.subject,
          text: template.content,
        })
      )
    );

    return results.map((result, index) => ({
      email: userEmails[index],
      success: result.status === "fulfilled",
      error: result.status === "rejected" ? result.reason : null,
    }));
  },

  async sendToSubscribers(template: EmailTemplate) {
    const subscribers = await prisma.user.findMany({
      where: {
        newsletterSubscribed: true,
      },
      select: {
        email: true,
      },
    });

    const subscriberEmails = subscribers.map((sub: { email: string }) => sub.email);
    return this.sendBulkEmail(subscriberEmails, template);
  },

  async sendToSpecificUsers(userIds: string[], template: EmailTemplate) {
    const users = await prisma.user.findMany({
      where: {
        id: {
          in: userIds,
        },
      },
      select: {
        email: true,
      },
    });

    const userEmails = users.map((user: { email: string }) => user.email);
    return this.sendBulkEmail(userEmails, template);
  },
};
