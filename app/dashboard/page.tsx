"use client";

import { DashboardActions } from "@src/components/dashboard/_actionsButton/DashboardActions";
import { ConfirmModal } from "@src/components/dashboard/_modals/ConfirmModal";
import { NoteModal } from "@src/components/dashboard/_modals/NoteModal";
import { SearchForm } from "@src/components/dashboard/_search/SearchForm";
import { FolderHeader } from "@src/components/dashboard/FolderHeader";
import { NoteList } from "@src/components/dashboard/NoteList";
import { useDashboard } from "@src/hooks/_useDashboard/useDashoard";

export default function Dashboard() {
  const {
    notes,
    isLoading,
    error,
    searchParams,
    editingNote,
    isDeleteModalOpen,
    isNoteModalOpen,
    setEditingNote,
    setIsNoteModalOpen,
    setDeleteNoteId,
    setIsDeleteModalOpen,
    handleSearch,
    handleNoteClick,
    handleRecordingComplete,
    closeNoteModal,
    handleSaveAndClose,
    handleInputChange,
    handleDeleteConfirm,
    onLoadMore,
    hasMore,
  } = useDashboard();

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
        setEditingNote={setEditingNote}
        setIsNoteModalOpen={setIsNoteModalOpen}
        onRecordingComplete={handleRecordingComplete}
      />

      <NoteList
        notes={notes}
        isLoading={isLoading}
        handleNoteClick={handleNoteClick}
        setEditingNote={setEditingNote}
        setIsNoteModalOpen={setIsNoteModalOpen}
        setDeleteNoteId={setDeleteNoteId}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        onLoadMore={onLoadMore}
        hasMore={hasMore}
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
        onConfirm={handleDeleteConfirm}
        title="Confirm Deletion"
        message="Are you sure you want to delete this note?"
      />
    </div>
  );
}
