import { auth } from "@src/lib/auth/auth";
import { prisma } from "@src/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true,
      timeLimit: true,
      currentPeriodUsedTime: true,
      currentPeriodRemainingTime: true,
      lastResetDate: true,
      _count: {
        select: { voiceNotes: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(users);
}
