import type { Folder } from "@generated/prisma/client";
import { voiceNotesService } from "./voiceNotesService";

export type CreateFolderData = {
  name: string;
  description: string | null;
  parentId?: string | null;
};

export type FolderServiceResponse<T> = {
  data?: T;
  error?: { message: string };
};

export const folderService = {
  async getFolders(): Promise<Folder[]> {
    const response = await fetch("/api/folders");
    if (!response.ok) {
      throw new Error("Failed to fetch folders");
    }
    return response.json();
  },

  async getFolderNotes(folderId: string): Promise<any[]> {
    const response = await fetch(`/api/folders/${folderId}/notes`);
    if (!response.ok) {
      throw new Error("Failed to fetch folder notes");
    }
    const notes = await response.json();
    return voiceNotesService.sortNotesByDate(notes);
  },

  async createFolder(data: CreateFolderData): Promise<FolderServiceResponse<Folder>> {
    try {
      const response = await fetch("/api/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        return { error: { message: "Failed to create folder" } };
      }

      const folder = await response.json();
      return { data: folder };
    } catch (error) {
      return {
        error: { message: error instanceof Error ? error.message : "Failed to create folder" },
      };
    }
  },

  async getSubFolders(parentId: string): Promise<Folder[]> {
    const response = await fetch(`/api/folders?parentId=${parentId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch subfolders");
    }
    return response.json();
  },

  async updateFolder(
    folderId: string,
    data: Partial<CreateFolderData>
  ): Promise<FolderServiceResponse<Folder>> {
    try {
      const response = await fetch(`/api/folders/${folderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        return { error: { message: "Failed to update folder" } };
      }

      const folder = await response.json();
      return { data: folder };
    } catch (error) {
      return {
        error: { message: error instanceof Error ? error.message : "Failed to update folder" },
      };
    }
  },

  async deleteFolder(folderId: string): Promise<FolderServiceResponse<void>> {
    try {
      const response = await fetch(`/api/folders/${folderId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        return { error: { message: "Failed to delete folder" } };
      }

      return {};
    } catch (error) {
      return {
        error: { message: error instanceof Error ? error.message : "Failed to delete folder" },
      };
    }
  },
};
