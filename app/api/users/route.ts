import { auth } from "@src/lib/auth/auth";
import { prisma } from "@src/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const users = await prisma.user.findMany({
      include: {
        voiceNotes: true,
      },
    });

    const usersWithTimeInfo = users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      timeLimit: user.timeLimit,
      currentPeriodUsedTime: user.currentPeriodUsedTime,
      currentPeriodRemainingTime: user.currentPeriodRemainingTime,
      lastResetDate: user.lastResetDate,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      emailVerified: user.emailVerified,
      notesCount: user.voiceNotes.length,
    }));

    return NextResponse.json(usersWithTimeInfo);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
