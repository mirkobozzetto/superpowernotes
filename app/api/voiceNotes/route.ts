import { auth } from "@/src/lib/auth/auth";
import { prisma } from "@/src/lib/prisma";
import { generateTags } from "@/src/lib/utils";
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
    return NextResponse.json(voiceNotes);
  } catch (error) {
    console.error("Error fetching voice notes:", error);
    return NextResponse.json({ error: "Error fetching voice notes" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { transcription, fileName, tags: userTags } = await request.json();
    if (!transcription) {
      return NextResponse.json({ error: "Transcription is required" }, { status: 400 });
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
        createdAt,
        userId: session.user.id!,
      },
    });

    return NextResponse.json(voiceNote, { status: 201 });
  } catch (error) {
    console.error("Error creating voice note:", error);
    return NextResponse.json({ error: "Error creating voice note" }, { status: 500 });
  }
}
