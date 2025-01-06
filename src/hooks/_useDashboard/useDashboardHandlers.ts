import { VoiceNote } from "@prisma/client";
import { useNoteManagerStore } from "@src/stores/noteManagerStore";
import { useCallback, useEffect } from "react";

export const useDashboardHandlers = () => {
  const { initialize, fetchNotes, saveNote, updateSearchParams } = useNoteManagerStore();

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

  const handleNoteClick = (
    note: VoiceNote,
    setEditingNote: Function,
    setIsNoteModalOpen: Function
  ) => {
    setEditingNote(note);
    setIsNoteModalOpen(true);
  };

  const handleRecordingComplete = useCallback(() => {
    fetchNotes();
  }, [fetchNotes]);

  const closeNoteModal = (setIsNoteModalOpen: Function, setEditingNote: Function) => {
    setIsNoteModalOpen(false);
    setEditingNote(undefined);
  };

  const handleSaveAndClose = async (
    note: Partial<VoiceNote>,
    setIsNoteModalOpen: Function,
    setEditingNote: Function
  ) => {
    try {
      await saveNote(note);
      setIsNoteModalOpen(false);
      setEditingNote(undefined);
    } catch (error) {
      console.error("Failed to save note:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateSearchParams(name, value);
  };

  return {
    handleNoteClick,
    handleRecordingComplete,
    closeNoteModal,
    handleSaveAndClose,
    handleInputChange,
  };
};
