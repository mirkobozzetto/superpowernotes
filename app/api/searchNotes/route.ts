import { prisma } from "@/src/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  console.log("Received GET request");
  const { searchParams } = new URL(request.url);
  const tags = searchParams.get("tags");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const keyword = searchParams.get("keyword");
  console.log("Query params:", { tags, startDate, endDate, keyword });

  const whereClause: Prisma.VoiceNoteWhereInput = {};

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

  console.log("Where clause:", whereClause);

  try {
    const notes = await prisma.voiceNote.findMany({ where: whereClause });
    console.log("Found notes:", notes.length);
    return NextResponse.json(notes);
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Error performing search" }, { status: 500 });
  }
}
