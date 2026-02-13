import type { Folder } from "@generated/prisma/client";
import { folderService } from "@src/services/hooks/folderService";
import { useCallback, useEffect, useState } from "react";

export const useFolderSelector = () => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [parentFolder, setParentFolder] = useState<Folder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

  const selectFolder = useCallback(
    (folderId: string | null) => {
      console.log("Selecting folder:", folderId);
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
