import { auth } from "@src/lib/auth/auth";
import { logger } from "@src/lib/logger";
import { prisma } from "@src/lib/prisma";
import { CreateFolderSchema } from "@src/validations/routes/folderRoute";
import { NextResponse } from "next/server";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const userId = session.user.id;

    const folder = await prisma.folder.findUnique({
      where: { id, userId },
    });
    if (!folder) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    }

    await prisma.$transaction(async (tx) => {
      const notes = await tx.notesToFolders.findMany({
        where: { folderId: id },
        select: { noteId: true },
      });

      for (const note of notes) {
        await tx.voiceNote.delete({
          where: { id: note.noteId },
        });
      }

      await tx.folder.delete({
        where: { id, userId },
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Error deleting folder" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    logger.warn("Unauthorized folder update attempt");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();
    const validatedData = CreateFolderSchema.parse(data);
    const { id } = await params;

    const folder = await prisma.folder.findUnique({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!folder) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    }

    const updatedFolder = await prisma.folder.update({
      where: { id, userId: session.user.id },
      data: {
        name: validatedData.name,
        description: validatedData.description,
      },
    });

    logger.info("Folder updated successfully", {
      userId: session.user.id,
      folderId: id,
    });

    return NextResponse.json(updatedFolder);
  } catch (error) {
    logger.error("Error updating folder", {
      userId: session.user.id,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return NextResponse.json({ error: "Error updating folder" }, { status: 500 });
  }
}
