import { prisma } from "@src/lib/prisma";
import { CreateFolderInput } from "@src/validations/routes/folderRoute";

export const folderQueryBuilder = {
  async createFolder(userId: string, data: CreateFolderInput) {
    return prisma.folder.create({
      data: {
        name: data.name,
        description: data.description,
        userId,
        parentId: data.parentId,
      },
    });
  },

  async getFolders(userId: string) {
    return prisma.folder.findMany({
      where: { userId },
      include: {
        subFolders: true,
        notesToFolders: {
          include: {
            note: {
              select: {
                id: true,
                fileName: true,
                transcription: true,
                tags: true,
                duration: true,
                createdAt: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },
};
