import type { Folder, VoiceNote } from "@prisma/client";
import { folderService } from "@src/services/folderService";
import { voiceNotesService } from "@src/services/voiceNotesService";
import type { SearchParamsType } from "@src/validations/routes/voiceNoteRoutes";
import { useCallback, useEffect, useMemo, useState } from "react";

export type FolderMap = { [key: string]: Folder[] };
export type NoteManagerState = {
  notes: VoiceNote[];
  folders: Folder[];
  selectedFolderId: string | null;
  searchParams: SearchParamsType;
  isLoading: boolean;
  error: string | null;
};

export function useNoteManager() {
  const [state, setState] = useState<NoteManagerState>({
    notes: [],
    folders: [],
    selectedFolderId: null,
    searchParams: {
      tags: "",
      startDate: "",
      endDate: "",
      keyword: "",
    },
    isLoading: false,
    error: null,
  });

  const setLoading = (isLoading: boolean) => {
    setState((prev) => ({ ...prev, isLoading }));
  };

  const setError = (error: string | null) => {
    setState((prev) => ({ ...prev, error }));
  };

  const fetchAllNotes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (state.selectedFolderId) {
        const folderNotes = await folderService.getFolderNotes(state.selectedFolderId);
        setState((prev) => ({ ...prev, notes: folderNotes }));
      } else {
        const { notes } = await voiceNotesService.getAllNotes();
        setState((prev) => ({ ...prev, notes }));
      }
    } catch (error) {
      setError("Failed to fetch notes. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [state.selectedFolderId]);

  const fetchFolders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await folderService.getFolders();
      setState((prev) => ({ ...prev, folders: data }));
    } catch (error) {
      setError("Failed to load projects");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

  useEffect(() => {
    fetchAllNotes();
  }, [fetchAllNotes]);

  const handleSearch = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          ...state.searchParams,
          ...(state.selectedFolderId && { folderId: state.selectedFolderId }),
        } as Record<string, string>);
        const response = await fetch(`/api/notes?${params}`);
        const data = await response.json();
        setState((prev) => ({ ...prev, notes: data.voiceNotes }));
      } catch (error) {
        setError("Search failed. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [state.searchParams, state.selectedFolderId]
  );

  const selectFolder = useCallback((folderId: string | null) => {
    setState((prev) => ({ ...prev, selectedFolderId: folderId }));
  }, []);

  const rootFolders = useMemo(() => {
    return state.folders.filter((folder) => !folder.parentId);
  }, [state.folders]);

  const subFolders = useMemo(() => {
    return state.folders.reduce<FolderMap>((acc, folder) => {
      if (folder.parentId) {
        if (!acc[folder.parentId]) {
          acc[folder.parentId] = [];
        }
        acc[folder.parentId].push(folder);
      }
      return acc;
    }, {});
  }, [state.folders]);

  return {
    ...state,
    rootFolders,
    subFolders,
    selectFolder,
    handleSearch,
    fetchAllNotes,
    refreshFolders: fetchFolders,
  };
}
