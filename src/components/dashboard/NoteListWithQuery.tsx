import { type VoiceNote } from "@prisma/client";
import { useNotes } from "@src/lib/query/hooks/notes/useNotes";
import { useEffect } from "react";
import { NoteList } from "./NoteList";

type NoteListWithQueryProps = {
  isLoading: boolean;
  handleNoteClick: (note: VoiceNote) => void;
  setEditingNote: (note: VoiceNote) => void;
  setIsNoteModalOpen: (isOpen: boolean) => void;
  setDeleteNoteId: (id: string) => void;
  setIsDeleteModalOpen: (isOpen: boolean) => void;
  selectedFolderId: string | null;
  onRecordingComplete?: () => void;
};

export const NoteListWithQuery = ({
  isLoading: baseIsLoading,
  handleNoteClick,
  setEditingNote,
  setIsNoteModalOpen,
  setDeleteNoteId,
  setIsDeleteModalOpen,
  selectedFolderId,
  onRecordingComplete,
}: NoteListWithQueryProps) => {
  const { notes, isLoading: queryLoading, startPolling } = useNotes(selectedFolderId);

  useEffect(() => {
    if (onRecordingComplete) {
      startPolling();
    }
  }, [onRecordingComplete, startPolling]);

  return (
    <NoteList
      notes={notes}
      isLoading={queryLoading || baseIsLoading}
      handleNoteClick={handleNoteClick}
      setEditingNote={setEditingNote}
      setIsNoteModalOpen={setIsNoteModalOpen}
      setDeleteNoteId={setDeleteNoteId}
      setIsDeleteModalOpen={setIsDeleteModalOpen}
    />
  );
};
