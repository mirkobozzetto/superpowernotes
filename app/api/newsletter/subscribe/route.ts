import NewsletterConfirmation from "@email/emails/NewsletterConfirmation";
import { render } from "@react-email/render";
import { prisma } from "@src/lib/prisma";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.AUTH_RESEND_KEY);
const APP_URL =
  process.env.NODE_ENV === "production" ? "https://www.superpowernot.es" : "http://localhost:3000";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Email invalide" }, { status: 400 });
    }

    const existingSubscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (existingSubscriber) {
      if (!existingSubscriber.subscribed) {
        const updatedSubscriber = await prisma.newsletterSubscriber.update({
          where: { email },
          data: {
            subscribed: true,
            updatedAt: new Date(),
          },
        });

        const unsubscribeUrl = `${APP_URL}/api/newsletter/unsubscribe/${updatedSubscriber.id}`;
        const emailHtml = (await render(NewsletterConfirmation())).replace(
          "{unsubscribeUrl}",
          unsubscribeUrl
        );

        await resend.emails.send({
          from: "Super Power Notes <onboarding@resend.dev>",
          to: email,
          subject: "Re-bienvenue à la newsletter Super Power Notes",
          html: emailHtml,
        });

        return NextResponse.json(
          {
            message: "Réabonnement effectué avec succès",
            subscriber: updatedSubscriber,
          },
          { status: 200 }
        );
      }
      return NextResponse.json(
        { error: "Cet email est déjà inscrit à la newsletter" },
        { status: 400 }
      );
    }

    const subscriber = await prisma.newsletterSubscriber.create({
      data: { email },
    });

    const unsubscribeUrl = `${APP_URL}/api/newsletter/unsubscribe/${subscriber.id}`;
    const emailHtml = (await render(NewsletterConfirmation())).replace(
      "{unsubscribeUrl}",
      unsubscribeUrl
    );

    await resend.emails.send({
      from: "Super Power Notes <onboarding@resend.dev>",
      to: email,
      subject: "Bienvenue à la newsletter Super Power Notes",
      html: emailHtml,
    });

    return NextResponse.json({ message: "Inscription réussie", subscriber }, { status: 201 });
  } catch (error: any) {
    console.error("Detailed error:", error);
    return NextResponse.json({ error: "Erreur lors de l'inscription" }, { status: 500 });
  }
}
