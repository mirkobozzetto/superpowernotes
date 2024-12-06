import { auth } from "@src/lib/auth/auth";
import { logger } from "@src/lib/logger";
import { prisma } from "@src/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) {
    logger.warn("Unauthorized folder notes access attempt");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const folder = await prisma.folder.findUnique({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      include: {
        notesToFolders: {
          include: {
            note: true,
          },
        },
      },
    });

    if (!folder) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    }

    const notes = folder.notesToFolders.map((nf) => nf.note);
    return NextResponse.json(notes);
  } catch (error) {
    logger.error("Error fetching folder notes", {
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return NextResponse.json({ error: "Error fetching folder notes" }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) {
    logger.warn("Unauthorized note to folder addition attempt");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { noteId } = await request.json();

    const [folder, note] = await Promise.all([
      prisma.folder.findUnique({
        where: {
          id: params.id,
          userId: session.user.id,
        },
      }),
      prisma.voiceNote.findUnique({
        where: {
          id: noteId,
          userId: session.user.id,
        },
      }),
    ]);

    if (!folder || !note) {
      return NextResponse.json({ error: "Folder or note not found" }, { status: 404 });
    }

    const noteToFolder = await prisma.notesToFolders.create({
      data: {
        folderId: folder.id,
        noteId: note.id,
      },
      include: {
        note: true,
      },
    });

    logger.info("Note added to folder successfully", {
      userId: session.user.id,
      folderId: folder.id,
      noteId: note.id,
    });

    return NextResponse.json(noteToFolder);
  } catch (error) {
    logger.error("Error adding note to folder", {
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return NextResponse.json({ error: "Error adding note to folder" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    logger.warn("Unauthorized folder deletion attempt");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const folderId = searchParams.get("id");

    if (!folderId) {
      return NextResponse.json({ error: "Folder ID is required" }, { status: 400 });
    }

    const folder = await prisma.folder.findUnique({
      where: {
        id: folderId,
        userId: session.user.id,
      },
      include: {
        subFolders: true,
      },
    });

    if (!folder) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    }

    await prisma.$transaction(async (tx) => {
      async function deleteFolder(folderId: string) {
        const subFolders = await tx.folder.findMany({
          where: { parentId: folderId },
        });

        for (const subFolder of subFolders) {
          await deleteFolder(subFolder.id);
        }

        await tx.folder.delete({ where: { id: folderId } });
      }

      await deleteFolder(folderId);
    });

    logger.info("Folder deleted successfully", {
      userId: session.user.id,
      folderId,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Error deleting folder", {
      userId: session.user.id,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return NextResponse.json({ error: "Error deleting folder" }, { status: 500 });
  }
}
