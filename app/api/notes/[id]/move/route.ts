import { auth } from "@src/lib/auth/auth";
import { logger } from "@src/lib/logger";
import { moveNoteQueries } from "@src/services/routes/notesQueryBuilder";
import { MoveFolderSchema } from "@src/validations/routes/notesMoveRoute";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    logger.warn("Unauthorized note move attempt");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: noteId } = await params;

  try {
    const body = await request.json();
    const validatedData = MoveFolderSchema.parse(body);

    if (validatedData.folderId) {
      const [note, folder] = await Promise.all([
        moveNoteQueries.validateNoteAccess(noteId, session.user.id),
        moveNoteQueries.validateFolderAccess(validatedData.folderId, session.user.id),
      ]);
      if (!note) {
        logger.warn("Note not found or unauthorized access", { noteId, userId: session.user.id });
        return NextResponse.json({ error: "Note not found" }, { status: 404 });
      }
      if (!folder) {
        logger.warn("Folder not found or unauthorized access", {
          folderId: validatedData.folderId,
          userId: session.user.id,
        });
        return NextResponse.json({ error: "Folder not found" }, { status: 404 });
      }
    } else {
      const note = await moveNoteQueries.validateNoteAccess(noteId, session.user.id);
      if (!note) {
        logger.warn("Note not found or unauthorized access", { noteId, userId: session.user.id });
        return NextResponse.json({ error: "Note not found" }, { status: 404 });
      }
    }

    await moveNoteQueries.moveNote(noteId, validatedData.folderId, session.user.id);

    logger.info("Note moved successfully", {
      noteId,
      folderId: validatedData.folderId || "removed from folder",
      userId: session.user.id,
    });

    return NextResponse.json({
      success: true,
      noteId,
      folderId: validatedData.folderId,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn("Invalid request data for note move", {
        userId: session.user.id,
        noteId,
        errors: error.errors,
      });
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    logger.error("Error moving note", {
      error: error instanceof Error ? error.message : "Unknown error",
      userId: session.user.id,
      noteId,
    });

    if (error instanceof Error && error.message.includes("not found")) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json({ error: "Error moving note" }, { status: 500 });
  }
}
