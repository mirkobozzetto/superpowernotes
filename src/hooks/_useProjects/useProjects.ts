import type { Folder, VoiceNote } from "@generated/prisma/client";
import { folderService } from "@src/services/folderService";
import { useCallback, useEffect, useMemo, useState } from "react";

export type FolderMap = { [key: string]: Folder[] };

export function useProjects() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [folderNotes, setFolderNotes] = useState<VoiceNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFolders = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await folderService.getFolders();
      setFolders(data);
    } catch (err) {
      console.error("Error loading projects:", err);
      setError("Failed to load projects");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchFolderNotes = useCallback(async (folderId: string | null) => {
    try {
      setIsLoading(true);
      if (!folderId) {
        const { voiceNotes } = await fetch("/api/voice-notes").then((r) => r.json());
        setFolderNotes(voiceNotes);
      } else {
        const notes = await folderService.getFolderNotes(folderId);
        setFolderNotes(notes);
      }
    } catch (err) {
      console.error("Error loading folder notes:", err);
      setError("Failed to load notes");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

  useEffect(() => {
    fetchFolderNotes(selectedFolderId);
  }, [selectedFolderId, fetchFolderNotes]);

  const rootFolders = useMemo(() => {
    const roots = folders.filter((folder) => !folder.parentId);
    return roots;
  }, [folders]);

  const subFolders = useMemo(() => {
    return folders.reduce<FolderMap>((acc, folder) => {
      if (folder.parentId) {
        if (!acc[folder.parentId]) {
          acc[folder.parentId] = [];
        }
        acc[folder.parentId].push(folder);
      }
      return acc;
    }, {});
  }, [folders]);

  const selectFolder = useCallback((folderId: string | null) => {
    setSelectedFolderId(folderId);
  }, []);

  return {
    folders,
    rootFolders,
    subFolders,
    selectedFolderId,
    folderNotes,
    isLoading,
    error,
    selectFolder,
    refreshFolders: fetchFolders,
  };
}
