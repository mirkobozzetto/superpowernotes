import { auth } from "@src/lib/auth/auth";
import { logger } from "@src/lib/logger";
import { prisma } from "@src/lib/prisma";
import { buildNotesQuery } from "@src/services/routes/notesQueryBuilder";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const tags = searchParams.get("tags");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const keyword = searchParams.get("keyword");
    const folderId = searchParams.get("folderId");

    let voiceNotes;

    if (folderId) {
      const folder = await prisma.folder.findUnique({
        where: {
          id: folderId,
          userId: session.user.id,
        },
        include: {
          notesToFolders: {
            include: {
              note: true,
            },
          },
        },
      });

      if (!folder) {
        return NextResponse.json({ error: "Folder not found" }, { status: 404 });
      }

      voiceNotes = folder.notesToFolders.map((nf) => nf.note);
    } else {
      const query = buildNotesQuery(session.user.id, {
        tags: tags ? tags.split(",").filter(Boolean) : undefined,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        keyword: keyword || undefined,
      });

      voiceNotes = await prisma.voiceNote.findMany(query);
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { timeLimit: true },
    });

    const totalUsedTime = voiceNotes.reduce((acc, note) => acc + (note.duration ?? 0), 0);
    const remainingTime = user ? user.timeLimit - totalUsedTime : 0;

    return NextResponse.json({ voiceNotes, remainingTime });
  } catch (error) {
    logger.error("Error fetching voice notes:", error);
    return NextResponse.json({ error: "Error fetching voice notes" }, { status: 500 });
  }
}
