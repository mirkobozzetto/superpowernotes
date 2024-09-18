import { auth } from "@/src/lib/auth/auth";
import { prisma } from "@/src/lib/prisma";
import { generateTags } from "@/src/lib/utils";
import { format } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

// This GET function handles fetching voice notes for an authenticated user
export async function GET() {
  // Check user authentication
  const session = await auth();
  if (!session || !session.user) {
    // Use NextResponse to return a 401 error if the user is not authenticated
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch all voice notes for the user, sorted by creation date in descending order
    const voiceNotes = await prisma.voiceNote.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });
    // Use NextResponse to return the voice notes as JSON
    return NextResponse.json(voiceNotes);
  } catch (error) {
    console.error("Error fetching voice notes:", error);
    // Use NextResponse to return a 500 error if there's a problem
    return NextResponse.json({ error: "Error fetching voice notes" }, { status: 500 });
  }
}

/**
 * Handles POST requests to create a new voice note.
 *
 * This function uses NextRequest, which is part of Next.js's API Routes. NextRequest
 * extends the standard Web Request interface with additional functionality specific
 * to Next.js, such as easier parsing of JSON bodies and handling of Next.js-specific
 * features like middleware.
 *
 * The function does the following:
 * 1. Authenticates the user using the 'auth()' function.
 * 2. Extracts transcription, fileName, and tags from the request body.
 * 3. Generates tags if not provided by the user.
 * 4. Creates a new voice note in the database using Prisma ORM.
 * 5. Returns the created voice note or an error response.
 *
 * NextRequest is used here to take advantage of Next.js's built-in request parsing
 * and response handling, making it easier to work with API routes in a Next.js application.
 */
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
