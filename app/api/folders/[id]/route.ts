import { auth } from "@src/lib/auth/auth";
import { logger } from "@src/lib/logger";
import { prisma } from "@src/lib/prisma";
import { CreateFolderSchema } from "@src/validations/routes/folderRoute";
import { NextResponse } from "next/server";

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.$transaction(async (tx) => {
      const notes = await tx.notesToFolders.findMany({
        where: { folderId: params.id },
        select: { noteId: true },
      });

      for (const note of notes) {
        await tx.voiceNote.delete({
          where: { id: note.noteId },
        });
      }

      await tx.folder.delete({
        where: { id: params.id },
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Error deleting folder" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) {
    logger.warn("Unauthorized folder update attempt");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();
    const validatedData = CreateFolderSchema.parse(data);

    const folder = await prisma.folder.findUnique({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!folder) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    }

    const updatedFolder = await prisma.folder.update({
      where: { id: params.id },
      data: {
        name: validatedData.name,
        description: validatedData.description,
      },
    });

    logger.info("Folder updated successfully", {
      userId: session.user.id,
      folderId: params.id,
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
