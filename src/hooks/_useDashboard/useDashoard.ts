import { VoiceNote } from "@prisma/client";
import { voiceNotesService } from "@src/services/voiceNotesService";
import { useNoteManagerStore } from "@src/stores/noteManagerStore";
import { useCallback, useEffect, useState } from "react";
import { useSyncNotes } from "./useSyncNotes";

export const useDashboard = () => {
  const {
    initialize,
    notes,
    isLoading,
    error,
    searchParams,
    handleSearch,
    updateSearchParams,
    saveNote,
    deleteNote,
    fetchNotes,
    selectedFolderId,
    setNotes,
    setLoading,
    setError,
  } = useNoteManagerStore();

  const { startSync, isSyncing, isProcessing } = useSyncNotes({
    notes,
    fetchNotes,
  });

  const [editingNote, setEditingNote] = useState<VoiceNote>();
  const [deleteNoteId, setDeleteNoteId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    const initializeData = async () => {
      await initialize();
    };
    initializeData();
  }, [initialize]);

  useEffect(() => {
    const handleNoteMoved = () => {
      fetchNotes();
    };

    window.addEventListener("noteMoved", handleNoteMoved);
    return () => window.removeEventListener("noteMoved", handleNoteMoved);
  }, [fetchNotes]);

  const handleLoadMore = useCallback(
    async (skip: number) => {
      if (isLoadingMore) return;

      try {
        setIsLoadingMore(true);
        setLoading(true);

        await new Promise((resolve) => setTimeout(resolve, 250));

        const response = await voiceNotesService.getAllNotes({
          skip,
          take: 4,
          ...(selectedFolderId && { folderId: selectedFolderId }),
        });

        if (response.hasMore !== undefined) {
          setHasMore(response.hasMore);
        }

        if (response.notes) {
          setNotes([...notes, ...response.notes]);
        }
      } catch (error) {
        console.error("Failed to load more notes:", error);
        setError("Failed to load more notes");
      } finally {
        setIsLoadingMore(false);
        setLoading(false);
      }
    },
    [notes, setNotes, selectedFolderId, setLoading, setError, isLoadingMore, setIsLoadingMore]
  );

  const handleNoteClick = useCallback((note: VoiceNote) => {
    setEditingNote(note);
    setIsNoteModalOpen(true);
  }, []);

  const handleRecordingComplete = useCallback(() => {
    setHasMore(true);
    startSync();
    fetchNotes();
  }, [fetchNotes, startSync]);

  const closeNoteModal = useCallback(() => {
    setIsNoteModalOpen(false);
    setEditingNote(undefined);
  }, []);

  const handleSaveAndClose = useCallback(
    async (note: Partial<VoiceNote>) => {
      try {
        setLoading(true);
        await saveNote(note);
        closeNoteModal();
        fetchNotes();
      } catch (error) {
        console.error("Failed to save note:", error);
        setError("Failed to save note");
      } finally {
        setLoading(false);
      }
    },
    [saveNote, closeNoteModal, fetchNotes, setLoading, setError]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      updateSearchParams(name, value);
    },
    [updateSearchParams]
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteNoteId) return;

    try {
      setLoading(true);
      await deleteNote(deleteNoteId);
      setIsDeleteModalOpen(false);
      fetchNotes();
    } catch (error) {
      console.error("Failed to delete note:", error);
      setError("Failed to delete note");
    } finally {
      setLoading(false);
    }
  }, [deleteNote, deleteNoteId, fetchNotes, setLoading, setError]);

  return {
    notes,
    isLoading: isLoading || isSyncing,
    isProcessing,
    error,
    searchParams,
    editingNote,
    deleteNoteId,
    isDeleteModalOpen,
    isNoteModalOpen,
    hasMore,
    setEditingNote,
    setDeleteNoteId,
    setIsDeleteModalOpen,
    setIsNoteModalOpen,
    handleSearch,
    handleNoteClick,
    handleRecordingComplete,
    closeNoteModal,
    handleSaveAndClose,
    handleInputChange,
    handleDeleteConfirm,
    onLoadMore: handleLoadMore,
  };
};
