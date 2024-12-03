import { auth } from "@src/lib/auth/auth";
import { logger } from "@src/lib/logger";
import { prisma } from "@src/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = params;
    const body = await request.json();
    logger.info("PUT request received", { params, body });
    const { transcription, tags, fileName, duration } = body;

    const existingNote = await prisma.voiceNote.findUnique({
      where: { id },
      include: {
        folders: {
          include: {
            folder: {
              select: {
                id: true,
                name: true,
                description: true,
                parentId: true,
              },
            },
          },
        },
      },
    });

    if (!existingNote || existingNote.userId !== session.user.id) {
      return NextResponse.json({ error: "Note not found or access denied" }, { status: 404 });
    }

    const updatedNote = await prisma.voiceNote.update({
      where: { id },
      data: {
        transcription,
        tags,
        fileName,
        duration,
        modifiedAt: new Date(),
      },
      include: {
        folders: {
          include: {
            folder: {
              select: {
                id: true,
                name: true,
                description: true,
                parentId: true,
              },
            },
          },
        },
      },
    });

    const formattedNote = {
      ...updatedNote,
      folders: updatedNote.folders.map((f) => f.folder),
    };

    return NextResponse.json(formattedNote);
  } catch (error) {
    logger.error("Error updating voice note:", error);
    return NextResponse.json({ error: "Error updating voice note" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = params;

    const existingNote = await prisma.voiceNote.findUnique({
      where: { id },
      include: {
        folders: true,
      },
    });

    if (!existingNote || existingNote.userId !== session.user.id) {
      return NextResponse.json({ error: "Note not found or access denied" }, { status: 404 });
    }

    await prisma.voiceNote.delete({
      where: { id },
    });

    logger.info("Note and its folder associations deleted successfully", {
      noteId: id,
      folderCount: existingNote.folders.length,
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    logger.error("Error deleting voice note:", error);
    return NextResponse.json({ error: "Error deleting voice note" }, { status: 500 });
  }
}
