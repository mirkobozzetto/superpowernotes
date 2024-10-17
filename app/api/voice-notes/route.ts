import { auth } from "@src/lib/auth/auth";
import { prisma } from "@src/lib/prisma";
import { audioService } from "@src/services/audioService";
import { format } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const voiceNotes = await prisma.voiceNote.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { timeLimit: true },
    });

    const totalUsedTime = voiceNotes.reduce((acc, note) => acc + (note.duration ?? 0), 0);
    const remainingTime = user ? user.timeLimit - totalUsedTime : 0;

    return NextResponse.json({ voiceNotes, remainingTime });
  } catch (error) {
    console.error("Error fetching voice notes:", error);
    return NextResponse.json({ error: "Error fetching voice notes" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { transcription, fileName, tags: userTags, duration } = await request.json();
    if (!transcription) {
      return NextResponse.json({ error: "Transcription is required" }, { status: 400 });
    }

    const formattedDate = format(new Date(), "yyyy-MM-dd HH:mm:ss");
    const finalFileName = fileName || formattedDate;

    const { voiceNote, remainingTime } = await audioService.saveVoiceNote(
      session.user.id,
      transcription,
      duration || 0,
      finalFileName,
      userTags || []
    );

    return NextResponse.json({ voiceNote, remainingTime }, { status: 201 });
  } catch (error) {
    console.error("Error creating note:", error);
    return NextResponse.json({ error: "Error creating note" }, { status: 500 });
  }
}
