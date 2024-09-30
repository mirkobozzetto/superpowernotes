import { auth } from "@src/lib/auth/auth";
import { prisma } from "@src/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { tokens: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  let remainingSeconds: number;
  if (user.role === "ADMIN") {
    remainingSeconds = Infinity;
  } else {
    const userToken = user.tokens[0];
    if (userToken) {
      remainingSeconds = Math.max(0, userToken.monthlySecondsLimit - userToken.usedSeconds);
    } else {
      remainingSeconds = 0;
    }
  }

  return NextResponse.json({ remainingSeconds });
}

export async function POST(req: Request) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { seconds } = await req.json();

  if (typeof seconds !== "number" || seconds <= 0) {
    return NextResponse.json({ error: "Invalid seconds value" }, { status: 400 });
  }

  try {
    const result = await prisma.$transaction(async (prisma) => {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { tokens: true },
      });

      if (!user) {
        throw new Error("User not found");
      }

      const userToken = user.tokens[0];
      if (!userToken) {
        throw new Error("User token not found");
      }

      if (
        user.role !== "ADMIN" &&
        userToken.usedSeconds + seconds > userToken.monthlySecondsLimit
      ) {
        throw new Error("Not enough credits");
      }

      const updatedToken = await prisma.token.update({
        where: { id: userToken.id },
        data: { usedSeconds: { increment: seconds } },
      });

      return updatedToken;
    });

    const remainingSeconds = Math.max(0, result.monthlySecondsLimit - result.usedSeconds);
    return NextResponse.json({ remainingSeconds });
  } catch (error) {
    console.error("Error updating credits:", error);
    return NextResponse.json({ error: "Failed to update credits" }, { status: 500 });
  }
}
