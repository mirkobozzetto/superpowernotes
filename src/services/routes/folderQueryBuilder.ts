import { prisma } from "@src/lib/prisma";

export const folderQueryBuilder = {
  async getFolders(userId: string) {
    return prisma.folder.findMany({
      where: { userId },
      include: {
        subFolders: true,
        notesToFolders: {
          include: {
            note: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async createFolder(
    userId: string,
    data: {
      name: string;
      description?: string | null;
      parentId?: string | null;
    }
  ) {
    return prisma.folder.create({
      data: {
        ...data,
        userId,
      },
      include: {
        subFolders: true,
        notesToFolders: {
          include: {
            note: true,
          },
        },
      },
    });
  },
};
