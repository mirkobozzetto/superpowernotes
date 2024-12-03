import { auth } from "@src/lib/auth/auth";
import { logger } from "@src/lib/logger";
import { prisma } from "@src/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
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

    return NextResponse.json({ voiceNotes: formattedNotes, remainingTime });
  } catch (error) {
    logger.error("Error fetching voice notes:", error);
    return NextResponse.json({ error: "Error fetching voice notes" }, { status: 500 });
  }
}
