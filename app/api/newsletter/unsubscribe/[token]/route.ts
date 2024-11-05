import { prisma } from "@src/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { token: string } }) {
  try {
    const token = params.token;
    const subscriber = await prisma.newsletterSubscriber.findFirst({
      where: { id: token },
    });

    if (!subscriber) {
      return NextResponse.json({ error: "Abonné non trouvé" }, { status: 404 });
    }

    await prisma.newsletterSubscriber.update({
      where: { id: token },
      data: { subscribed: false },
    });

    return NextResponse.redirect(new URL("/?unsubscribed=true", request.url));
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la désinscription" }, { status: 500 });
  }
}
