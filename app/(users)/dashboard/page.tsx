"use client";

import { VoiceNote } from "@prisma/client";
import { ConfirmModal } from "@src/components/dashboard/_modals/ConfirmModal";
import { NoteModal } from "@src/components/dashboard/_modals/NoteModal";
import { SearchForm } from "@src/components/dashboard/_search/SearchForm";
import { CreateNoteButton } from "@src/components/dashboard/CreateNoteButton";
import { NoteList } from "@src/components/dashboard/NoteList";
import { useNoteManagerStore } from "@src/stores/noteManagerStore";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const {
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
    fetchNotes();
  }, [fetchNotes]);

  const handleNoteClick = (note: VoiceNote) => {
    setEditingNote(note);
    setIsNoteModalOpen(true);
  };

  const closeNoteModal = () => {
    setIsNoteModalOpen(false);
    setEditingNote(undefined);
  };

  const handleSaveAndClose = async (note: Partial<VoiceNote>) => {
    try {
      await saveNote(note);
      closeNoteModal();
    } catch (error) {
      console.error("Failed to save note:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateSearchParams(name, value);
  };

  return (
    <div className="space-y-4 mx-auto p-4 container">
      {error && <div className="mb-4 text-red-500">{error}</div>}

      <SearchForm
        searchParams={searchParams}
        handleSearch={handleSearch}
        handleInputChange={handleInputChange}
        isLoading={isLoading}
      />

      <CreateNoteButton
        isLoading={isLoading}
        setEditingNote={(note) => setEditingNote(note as VoiceNote)}
        setIsNoteModalOpen={setIsNoteModalOpen}
      />

      <NoteList
        notes={notes}
        isLoading={isLoading}
        handleNoteClick={handleNoteClick}
        setEditingNote={setEditingNote}
        setIsNoteModalOpen={setIsNoteModalOpen}
        setDeleteNoteId={setDeleteNoteId}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
      />

      <NoteModal
        isOpen={isNoteModalOpen}
        onClose={closeNoteModal}
        onSave={handleSaveAndClose}
        note={editingNote}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => (deleteNoteId ? deleteNote(deleteNoteId) : Promise.resolve())}
        title="Confirm Deletion"
        message="Are you sure you want to delete this note?"
      />
    </div>
  );
}
