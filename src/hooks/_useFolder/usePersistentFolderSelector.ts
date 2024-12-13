import type { Folder } from "@prisma/client";
import { folderService } from "@src/services/hooks/folderService";
import { useNoteManagerStore } from "@src/stores/noteManagerStore";
import { useCallback, useEffect, useState } from "react";

const SELECTED_FOLDER_KEY = "lastSelectedFolder";

export const usePersistentFolderSelector = () => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [parentFolder, setParentFolder] = useState<Folder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { selectFolder: setGlobalFolder, selectedFolderId } = useNoteManagerStore();

  const fetchFolders = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error: serviceError } = await folderService.fetchFolders();

      if (serviceError) {
        throw new Error(serviceError.message);
      }

      if (data) {
        setFolders(data);
      }
    } catch (err) {
      console.error("Error fetching folders:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch folders");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const selectFolder = useCallback(
    (folderId: string | null) => {
      if (!folderId) {
        setSelectedFolder(null);
        setParentFolder(null);
        setGlobalFolder(null);
        localStorage.setItem(SELECTED_FOLDER_KEY, "");
        return;
      }

      const folder = folders.find((f) => f.id === folderId);
      if (folder) {
        setSelectedFolder(folder);
        if (folder.parentId) {
          const parent = folders.find((f) => f.id === folder.parentId);
          setParentFolder(parent || null);
        }
        setGlobalFolder(folderId);
        localStorage.setItem(SELECTED_FOLDER_KEY, folderId);
      }
    },
    [folders, setGlobalFolder]
  );

  useEffect(() => {
    const savedFolderId = localStorage.getItem(SELECTED_FOLDER_KEY);
    if (savedFolderId && folders.length > 0) {
      selectFolder(savedFolderId);
    }
  }, [folders, selectFolder]);

  useEffect(() => {
    if (selectedFolderId && folders.length > 0 && !selectedFolder) {
      selectFolder(selectedFolderId);
    }
  }, [selectedFolderId, folders, selectedFolder, selectFolder]);

  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

  const currentFolders = folders.filter((folder) =>
    !selectedFolder ? !folder.parentId : folder.parentId === selectedFolder.id
  );

  const navigateToParent = useCallback(() => {
    if (parentFolder) {
      selectFolder(parentFolder.id);
    }
  }, [parentFolder, selectFolder]);

  return {
    folders,
    selectedFolder,
    isLoading,
    error,
    selectFolder,
    parentFolder,
    navigateToParent,
    currentFolders,
    refetchFolders: fetchFolders,
  };
};
