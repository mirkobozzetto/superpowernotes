import type { Folder } from "@prisma/client";
import { folderService } from "@src/services/folderService";
import { useCallback, useEffect, useMemo, useState } from "react";

export type FolderMap = { [key: string]: Folder[] };

export function useProjects() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFolders = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await folderService.getFolders();
      console.log("Fetched folders:", data);
      setFolders(data);
      setIsLoading(false);
    } catch (err) {
      console.error("Error loading projects:", err);
      setError("Failed to load projects");
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

  const rootFolders = useMemo(() => {
    console.log("Computing root folders from:", folders);
    const roots = folders.filter((folder) => {
      console.log("Checking folder:", folder.name, "parentId:", folder.parentId);
      return !folder.parentId;
    });
    console.log("Root folders:", roots);
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
    console.log("Selecting folder:", folderId);
    setSelectedFolderId(folderId);
  }, []);

  return {
    folders,
    rootFolders,
    subFolders,
    selectedFolderId,
    isLoading,
    error,
    selectFolder,
    refreshFolders: fetchFolders,
  };
}
