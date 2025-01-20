import { auth } from "@src/lib/auth/auth";
import { logger } from "@src/lib/logger";
import { prisma } from "@src/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const skip = parseInt(searchParams.get("skip") ?? "0");
    const take = parseInt(searchParams.get("take") ?? "4");

    const total = await prisma.voiceNote.count({
      where: { userId: session.user.id },
    });

    const voiceNotes = await prisma.voiceNote.findMany({
      where: { userId: session.user.id },
      include: {
        folders: {
          include: {
            folder: {
              select: {
                id: true,
                name: true,
                description: true,
                parentId: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take,
    });

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { timeLimit: true },
    });

    const totalUsedTime = voiceNotes.reduce((acc, note) => acc + (note.duration ?? 0), 0);
    const remainingTime = user ? user.timeLimit - totalUsedTime : 0;

    const formattedNotes = voiceNotes.map((note) => ({
      ...note,
      folders: note.folders.map((f) => f.folder),
    }));

    const hasMore = skip + take < total;

    return NextResponse.json({
      voiceNotes: formattedNotes,
      remainingTime,
      hasMore,
      total,
    });
  } catch (error) {
    logger.error("Error fetching voice notes:", error);
    return NextResponse.json({ error: "Error fetching voice notes" }, { status: 500 });
  }
}
