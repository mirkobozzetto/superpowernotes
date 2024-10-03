import { Prisma } from "@prisma/client";
import { auth } from "@src/lib/auth/auth";
import { prisma } from "@src/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const { searchParams } = new URL(request.url);
  const tags = searchParams.get("tags");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const keyword = searchParams.get("keyword");

  const whereClause: Prisma.VoiceNoteWhereInput = { userId };

  if (tags) {
    whereClause.tags = { hasSome: tags.split(",") };
  }

  if (startDate && endDate) {
    whereClause.createdAt = {
      gte: new Date(startDate),
      lte: new Date(endDate),
    };
  }

  if (keyword) {
    whereClause.transcription = {
      contains: keyword,
      mode: "insensitive",
    };
  }

  try {
    const notes = await prisma.voiceNote.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(notes);
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Error performing search" }, { status: 500 });
  }
}
