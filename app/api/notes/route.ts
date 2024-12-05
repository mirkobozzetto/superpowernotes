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

    const parsedTags = tags ? tags.split(",").filter(Boolean) : undefined;
    const parsedStartDate = startDate ? new Date(startDate) : undefined;
    const parsedEndDate = endDate ? new Date(endDate) : undefined;

    const query = buildNotesQuery(session.user.id, {
      tags: parsedTags,
      startDate: parsedStartDate,
      endDate: parsedEndDate,
      keyword: keyword || undefined,
    });

    const voiceNotes = await prisma.voiceNote.findMany(query);

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

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    logger.warn("Unauthorized note creation attempt");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();
    const { fileName, transcription, tags, duration } = data;

    const newNote = await prisma.voiceNote.create({
      data: {
        fileName,
        transcription,
        tags: tags || [],
        duration: duration || 0,
        userId: session.user.id,
      },
    });

    logger.info("Note created successfully", {
      userId: session.user.id,
      noteId: newNote.id,
    });

    return NextResponse.json(newNote);
  } catch (error) {
    logger.error("Error creating note", {
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return NextResponse.json({ error: "Error creating note" }, { status: 500 });
  }
}
