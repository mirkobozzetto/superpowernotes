import { prisma } from "@src/lib/prisma";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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
        await prisma.newsletterSubscriber.update({
          where: { email },
          data: { subscribed: true },
        });
        return NextResponse.json({ message: "Réabonnement effectué avec succès" }, { status: 200 });
      }
      return NextResponse.json(
        { error: "Cet email est déjà inscrit à la newsletter" },
        { status: 400 }
      );
    }

    const subscriber = await prisma.newsletterSubscriber.create({
      data: { email },
    });

    await resend.emails.send({
      from: "VoiceNote <onboarding@resend.dev>",
      to: email,
      subject: "Confirmation d'inscription à la newsletter",
      html: `
        <h2>Merci de votre inscription !</h2>
        <p>Vous recevrez désormais nos actualités directement dans votre boîte mail.</p>
      `,
    });

    return NextResponse.json({ message: "Inscription réussie", subscriber }, { status: 201 });
  } catch (error: any) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json({ error: "Erreur lors de l'inscription" }, { status: 500 });
  }
}
