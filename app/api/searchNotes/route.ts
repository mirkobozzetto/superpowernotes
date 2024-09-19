import { prisma } from "@/src/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Log the received GET request
  console.log("Received GET request");

  // Extract query parameters from the request URL
  const { searchParams } = new URL(request.url);
  const tags = searchParams.get("tags");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const keyword = searchParams.get("keyword");

  // Log the extracted query parameters
  console.log("Query params:", { tags, startDate, endDate, keyword });

  // Initialize the where clause for the database query
  const whereClause: Prisma.VoiceNoteWhereInput = {};

  // Add tags filter to the where clause if provided
  if (tags) {
    whereClause.tags = { hasSome: tags.split(",") };
  }

  // Add date range filter to the where clause if both start and end dates are provided
  if (startDate && endDate) {
    whereClause.createdAt = {
      gte: new Date(startDate), // Greater than or equal to the start date
      lte: new Date(endDate), // Less than or equal to the end date
    };
  }

  // Add keyword filter to the where clause if provided
  if (keyword) {
    whereClause.transcription = {
      contains: keyword,
      mode: "insensitive",
    };
  }

  // Log the constructed where clause
  console.log("Where clause:", whereClause);

  try {
    // Query the database for voice notes matching the where clause
    const notes = await prisma.voiceNote.findMany({ where: whereClause });

    // Log the number of notes found
    console.log("Found notes:", notes.length);

    // Return the found notes as a JSON response
    return NextResponse.json(notes);
  } catch (error) {
    // Log any errors that occur during the search
    console.error("Search error:", error);

    // Return an error response if the search fails
    return NextResponse.json({ error: "Error performing search" }, { status: 500 });
  }
}
