import { prisma } from "@src/lib/prisma";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.AUTH_RESEND_KEY);

export async function POST(request: Request) {
  console.log("1. Starting newsletter subscription route");

  try {
    const body = await request.json();
    console.log("2. Received request body:", body);

    const { email } = body;

    if (!email || !email.includes("@")) {
      console.log("3. Invalid email format");
      return NextResponse.json({ error: "Email invalide" }, { status: 400 });
    }

    console.log("4. Checking for existing subscriber");
    const existingSubscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (existingSubscriber) {
      console.log("5. Subscriber exists:", existingSubscriber);
      if (!existingSubscriber.subscribed) {
        console.log("6. Reactivating subscription");
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

    console.log("7. Creating new subscriber");
    const subscriber = await prisma.newsletterSubscriber.create({
      data: { email },
    });

    console.log("8. Sending confirmation email");
    try {
      const emailResult = await resend.emails.send({
        from: "Super Power Notes <onboarding@resend.dev>",
        to: email,
        subject: "Confirmation d'inscription à la newsletter",
        html: `
          <h2>Merci de votre inscription !</h2>
          <p>Vous recevrez désormais nos actualités directement dans votre boîte mail.</p>
        `,
      });
      console.log("Email sending response:", emailResult);
    } catch (emailError) {
      console.error("Resend error details:", emailError);
    }

    console.log("9. Subscription process completed successfully");
    return NextResponse.json({ message: "Inscription réussie", subscriber }, { status: 201 });
  } catch (error: any) {
    console.error("10. Detailed error:", {
      message: error.message,
      stack: error.stack,
      cause: error.cause,
    });
    return NextResponse.json({ error: "Erreur lors de l'inscription" }, { status: 500 });
  }
}
