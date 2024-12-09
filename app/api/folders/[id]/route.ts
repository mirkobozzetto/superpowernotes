import { auth } from "@src/lib/auth/auth";
import { logger } from "@src/lib/logger";
import { prisma } from "@src/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) {
    logger.warn("Unauthorized folder deletion attempt");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const folder = await prisma.folder.findUnique({
      where: {
        id: params.id,
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

      await deleteFolder(params.id);
    });

    logger.info("Folder deleted successfully", {
      userId: session.user.id,
      folderId: params.id,
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
