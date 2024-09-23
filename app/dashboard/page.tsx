"use client";
import { VoiceNote } from "@prisma/client";
import ConfirmModal from "@src/components/dashboard/_modals/ConfirmModal";
import NoteModal from "@src/components/dashboard/_modals/NoteModal";
import SearchForm from "@src/components/dashboard/_search/SearchForm";
import NoteList from "@src/components/dashboard/NoteList";
import { useDashboard } from "@src/hooks/useDashoard";
import { useState } from "react";

export default function Dashboard() {
  const {
    notes,
    isLoading,
    error,
    searchParams,
    handleSearch,
    handleInputChange,
    handleSaveNote,
    handleDelete,
  } = useDashboard();

  const [editingNote, setEditingNote] = useState<VoiceNote | undefined>(undefined);
  const [deleteNoteId, setDeleteNoteId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);

  const handleNoteClick = (note: VoiceNote) => {
    setEditingNote(note);
    setIsNoteModalOpen(true);
  };

  const closeNoteModal = () => {
    setIsNoteModalOpen(false);
    setEditingNote(undefined);
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      {error && <div className="text-red-500 mb-4">{error}</div>}

      <SearchForm
        searchParams={searchParams}
        handleSearch={handleSearch}
        handleInputChange={handleInputChange}
        isLoading={isLoading}
      />

      <button
        onClick={() => {
          setEditingNote(undefined);
          setIsNoteModalOpen(true);
        }}
        className="w-full border font-bold py-2 px-4 rounded-full hover:bg-gray-100 transition-colors duration-200"
        disabled={isLoading}
      >
        Create New Note
      </button>

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
        onSave={handleSaveNote}
        note={editingNote}
      />
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => (deleteNoteId ? handleDelete(deleteNoteId) : Promise.resolve())}
        title="Confirm Deletion"
        message="Are you sure you want to delete this note? This action cannot be undone."
      />
    </div>
  );
}
