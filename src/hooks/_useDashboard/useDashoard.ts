import { VoiceNote } from "@prisma/client";
import { useNoteManagerStore } from "@src/stores/noteManagerStore";
import { useCallback, useEffect, useState } from "react";

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
  } = useNoteManagerStore();

  const [editingNote, setEditingNote] = useState<VoiceNote | undefined>(undefined);
  const [deleteNoteId, setDeleteNoteId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);

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

  const handleNoteClick = useCallback((note: VoiceNote) => {
    setEditingNote(note);
    setIsNoteModalOpen(true);
  }, []);

  const handleRecordingComplete = useCallback(() => {
    fetchNotes();
  }, [fetchNotes]);

  const closeNoteModal = useCallback(() => {
    setIsNoteModalOpen(false);
    setEditingNote(undefined);
  }, []);

  const handleSaveAndClose = useCallback(
    async (note: Partial<VoiceNote>) => {
      try {
        await saveNote(note);
        closeNoteModal();
      } catch (error) {
        console.error("Failed to save note:", error);
      }
    },
    [saveNote, closeNoteModal]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      updateSearchParams(name, value);
    },
    [updateSearchParams]
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (deleteNoteId) {
      await deleteNote(deleteNoteId);
      setIsDeleteModalOpen(false);
    }
  }, [deleteNote, deleteNoteId]);

  return {
    notes,
    isLoading,
    error,
    searchParams,
    editingNote,
    deleteNoteId,
    isDeleteModalOpen,
    isNoteModalOpen,

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
  };
};
