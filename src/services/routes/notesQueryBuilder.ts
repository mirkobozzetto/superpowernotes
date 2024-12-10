import { Prisma } from "@prisma/client";
import { prisma } from "@src/lib/prisma";

export const buildNotesQuery = (
  userId: string,
  params: {
    tags?: string[];
    startDate?: Date;
    endDate?: Date;
    keyword?: string;
  }
): Prisma.VoiceNoteFindManyArgs => {
  const whereClause: Prisma.VoiceNoteWhereInput = { userId };

  if (params.tags?.length) {
    whereClause.tags = { hasSome: params.tags };
  }

  if (params.startDate && params.endDate) {
    whereClause.createdAt = {
      gte: params.startDate,
      lte: params.endDate,
    };
  }

  if (params.keyword) {
    whereClause.transcription = {
      contains: params.keyword,
      mode: "insensitive",
    };
  }

  return {
    where: whereClause,
    orderBy: { createdAt: "desc" },
  };
};

export const moveNoteQueries = {
  async validateNoteAccess(noteId: string, userId: string) {
    return prisma.voiceNote.findUnique({
      where: {
        id: noteId,
        userId,
      },
    });
  },

  async validateFolderAccess(folderId: string, userId: string) {
    return prisma.folder.findUnique({
      where: {
        id: folderId,
        userId,
      },
    });
  },

  async moveNote(noteId: string, folderId: string | null, userId: string) {
    const note = await this.validateNoteAccess(noteId, userId);
    if (!note) {
      throw new Error("Note not found or unauthorized");
    }

    if (folderId) {
      const folder = await this.validateFolderAccess(folderId, userId);
      if (!folder) {
        throw new Error("Folder not found or unauthorized");
      }
    }

    return prisma.$transaction(async (tx) => {
      await tx.notesToFolders.deleteMany({
        where: { noteId },
      });

      if (folderId) {
        await tx.notesToFolders.create({
          data: {
            noteId,
            folderId,
          },
        });
      }
    });
  },
};
