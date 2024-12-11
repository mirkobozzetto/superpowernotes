import { useNoteManagerStore } from "@src/stores/noteManagerStore";
import { useEffect } from "react";

const SELECTED_FOLDER_KEY = "lastSelectedFolder";

export const useSelectedFolder = () => {
  const { selectFolder, selectedFolderId } = useNoteManagerStore();

  useEffect(() => {
    const savedFolderId = localStorage.getItem(SELECTED_FOLDER_KEY);
    if (savedFolderId) {
      selectFolder(savedFolderId);
    }
  }, [selectFolder]);

  useEffect(() => {
    if (selectedFolderId !== undefined) {
      localStorage.setItem(SELECTED_FOLDER_KEY, selectedFolderId || "");
    }
  }, [selectedFolderId]);

  return { selectedFolderId };
};
