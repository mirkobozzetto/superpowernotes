import { auth } from "@src/lib/auth/auth";
import { prisma } from "@src/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session || (!session.user?.id && session.user?.role !== "ADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        timeLimit: true,
        currentPeriodUsedTime: true,
        currentPeriodRemainingTime: true,
        lastResetDate: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user usage:", error);
    return NextResponse.json({ error: "Failed to fetch user usage" }, { status: 500 });
  }
}
