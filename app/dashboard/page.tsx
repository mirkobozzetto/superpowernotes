"use client";

import { VoiceNote } from "@prisma/client";
import { ConfirmModal } from "@src/components/dashboard/_modals/ConfirmModal";
import { NoteModal } from "@src/components/dashboard/_modals/NoteModal";
import { SearchForm } from "@src/components/dashboard/_search/SearchForm";
import { DashboardActions } from "@src/components/dashboard/DashboardActions";
import { FolderHeader } from "@src/components/dashboard/FolderHeader";
import { NoteListWithQuery } from "@src/components/dashboard/NoteListWithQuery";
import { useDashboardHandlers } from "@src/hooks/_useDashboard/useDashboardHandlers";
import { useNotesRefetch } from "@src/lib/query/hooks/notes/useNotesRefetch";
import { useNoteManagerStore } from "@src/stores/noteManagerStore";
import { useState } from "react";

export default function Dashboard() {
  const { isLoading, error, searchParams, handleSearch, deleteNote } = useNoteManagerStore();
  const { invalidateNotes } = useNotesRefetch();
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  const {
    handleNoteClick,
    handleRecordingComplete: baseHandleRecordingComplete,
    closeNoteModal,
    handleSaveAndClose,
    handleInputChange,
  } = useDashboardHandlers();

  const [editingNote, setEditingNote] = useState<VoiceNote | undefined>(undefined);
  const [deleteNoteId, setDeleteNoteId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);

  const handleRecordingComplete = async () => {
    await invalidateNotes();
    baseHandleRecordingComplete();
  };

  return (
    <div className="space-y-4 mx-auto p-4 container md:pt-4 pt-20 pb-20">
      {error && <div className="mb-4 text-red-500">{error}</div>}

      <FolderHeader />

      <SearchForm
        searchParams={searchParams}
        handleSearch={handleSearch}
        handleInputChange={handleInputChange}
        isLoading={isLoading}
      />

      <DashboardActions
        isLoading={isLoading}
        setEditingNote={(note: Partial<VoiceNote>) => setEditingNote(note as VoiceNote | undefined)}
        setIsNoteModalOpen={setIsNoteModalOpen}
        onRecordingComplete={handleRecordingComplete}
      />

      <NoteListWithQuery
        isLoading={isLoading}
        selectedFolderId={selectedFolderId}
        handleNoteClick={(note) => handleNoteClick(note, setEditingNote, setIsNoteModalOpen)}
        setEditingNote={setEditingNote}
        setIsNoteModalOpen={setIsNoteModalOpen}
        setDeleteNoteId={setDeleteNoteId}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        onRecordingComplete={handleRecordingComplete}
      />

      <NoteModal
        isOpen={isNoteModalOpen}
        onClose={() => closeNoteModal(setIsNoteModalOpen, setEditingNote)}
        onSave={(note) => handleSaveAndClose(note, setIsNoteModalOpen, setEditingNote)}
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
