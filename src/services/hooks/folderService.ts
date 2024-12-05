import type { Folder } from "@prisma/client";

export type CreateFolderData = {
  name: string;
  description?: string;
  parentId?: string | null;
};

export type FolderServiceResponse<T> = {
  data?: T;
  error?: {
    message: string;
  };
};

export const folderService = {
  async fetchFolders(): Promise<FolderServiceResponse<Folder[]>> {
    try {
      const response = await fetch("/api/folders");
      if (!response.ok) {
        return { error: { message: "Failed to fetch folders" } };
      }
      const data = await response.json();
      return { data };
    } catch (err) {
      return {
        error: {
          message: err instanceof Error ? err.message : "Failed to fetch folders",
        },
      };
    }
  },

  async createFolder(data: CreateFolderData): Promise<FolderServiceResponse<Folder>> {
    try {
      const response = await fetch("/api/folders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        return { error: { message: "Failed to create folder" } };
      }

      const folder = await response.json();
      return { data: folder };
    } catch (err) {
      return {
        error: {
          message: err instanceof Error ? err.message : "Failed to create folder",
        },
      };
    }
  },

  async getFolderNotes(folderId: string): Promise<FolderServiceResponse<any[]>> {
    try {
      const response = await fetch(`/api/folders/${folderId}/notes`);
      if (!response.ok) {
        return { error: { message: "Failed to fetch folder notes" } };
      }
      const data = await response.json();
      return { data };
    } catch (err) {
      return {
        error: {
          message: err instanceof Error ? err.message : "Failed to fetch folder notes",
        },
      };
    }
  },
};
