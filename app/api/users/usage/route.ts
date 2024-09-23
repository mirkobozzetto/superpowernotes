import { auth } from "@src/lib/auth/auth";
import { prisma } from "@src/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      role: true,
      monthlySecondsLimit: true,
      usedSeconds: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const remainingSeconds =
    user.role === "ADMIN" ? Infinity : Math.max(0, user.monthlySecondsLimit - user.usedSeconds);

  return NextResponse.json({ remainingSeconds });
}
