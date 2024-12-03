import type { Folder } from "@prisma/client";
import { folderService } from "@src/services/routes/folderService";
import { useCallback, useEffect, useState } from "react";

export const useFolderSelector = () => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [parentFolder, setParentFolder] = useState<Folder | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFolders = useCallback(async () => {
    try {
      setIsLoading(true);
      const fetchedFolders = await folderService.getFolders();
      setFolders(fetchedFolders);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch folders");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

  const createFolder = async (data: { name: string; description?: string }) => {
    try {
      setIsLoading(true);
      const newFolder = await folderService.createFolder({
        ...data,
        parentId: selectedFolder?.id,
      });
      setFolders((prev) => [...prev, newFolder]);
      return newFolder;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create folder");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const selectFolder = useCallback(
    (folderId: string | null) => {
      if (!folderId) {
        setSelectedFolder(null);
        setParentFolder(null);
        return;
      }

      const folder = folders.find((f) => f.id === folderId);
      if (folder) {
        setSelectedFolder(folder);
        if (folder.parentId) {
          const parent = folders.find((f) => f.id === folder.parentId);
          setParentFolder(parent || null);
        }
      }
    },
    [folders]
  );

  const navigateToParent = useCallback(() => {
    if (parentFolder) {
      selectFolder(parentFolder.id);
    }
  }, [parentFolder, selectFolder]);

  const currentFolders = folders.filter(
    (folder) => folder.parentId === selectedFolder?.id || (!selectedFolder && !folder.parentId)
  );

  return {
    folders,
    selectedFolder,
    isLoading,
    error,
    createFolder,
    selectFolder,
    parentFolder,
    navigateToParent,
    currentFolders,
  };
};
