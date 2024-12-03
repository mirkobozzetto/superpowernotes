import type { Folder } from "@prisma/client";

export type CreateFolderData = {
  name: string;
  description?: string;
  parentId?: string | null;
};

export const folderService = {
  async getFolders(): Promise<Folder[]> {
    const response = await fetch("/api/folders");
    if (!response.ok) {
      throw new Error("Failed to fetch folders");
    }
    return response.json();
  },

  async createFolder(data: CreateFolderData): Promise<Folder> {
    const response = await fetch("/api/folders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to create folder");
    }

    return response.json();
  },

  async getFolderNotes(folderId: string): Promise<Folder> {
    const response = await fetch(`/api/folders/${folderId}/notes`);
    if (!response.ok) {
      throw new Error("Failed to fetch folder notes");
    }
    return response.json();
  },
};
