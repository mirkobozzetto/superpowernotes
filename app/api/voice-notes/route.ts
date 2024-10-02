import { User, VoiceNote } from "@prisma/client";
import { auth } from "@src/lib/auth/auth";
import { prisma } from "@src/lib/prisma";
import { generateTags } from "@src/lib/utils";
import { format } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

const calculateRemainingTime = (user: User, voiceNotes: VoiceNote[], newDuration: number = 0) => {
  const totalUsedTime = voiceNotes.reduce((acc, note) => acc + note.duration, 0) + newDuration;
  return Math.max(0, user.timeLimit - totalUsedTime);
};

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

    const totalUsedTime = voiceNotes.reduce((acc, note) => acc + note.duration, 0);
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
    if (!transcription || typeof duration !== "number" || duration <= 0) {
      return NextResponse.json(
        { error: "Transcription and valid duration are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { voiceNotes: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const remainingTime = calculateRemainingTime(user, user.voiceNotes, duration);
    if (remainingTime < duration) {
      return NextResponse.json({ error: "Time limit exceeded" }, { status: 403 });
    }

    const createdAt = new Date();
    const formattedDate = format(createdAt, "yyyy-MM-dd HH:mm:ss");
    let tags: string[] = Array.isArray(userTags) ? userTags : [];
    if (tags.length === 0) {
      tags = await generateTags(transcription);
    }

    const voiceNote = await prisma.voiceNote.create({
      data: {
        transcription,
        fileName: fileName || formattedDate,
        tags,
        duration: Math.round(duration),
        userId: session.user.id,
      },
    });

    const updatedRemainingTime = calculateRemainingTime(user, [...user.voiceNotes, voiceNote]);

    return NextResponse.json({ voiceNote, remainingTime: updatedRemainingTime }, { status: 201 });
  } catch (error) {
    console.error("Error creating voice note:", error);
    return NextResponse.json({ error: "Error creating voice note" }, { status: 500 });
  }
}
