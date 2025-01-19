import { VoiceNote } from "@prisma/client";
import { useNoteManagerStore } from "@src/stores/noteManagerStore";
import { useEffect, useState } from "react";

type UseDashboardActionsProps = {
  setEditingNote: (note: VoiceNote | undefined) => void;
  setIsNoteModalOpen: (isOpen: boolean) => void;
  onRecordingComplete: () => void;
};

export const useDashboardActions = ({
  setEditingNote,
  setIsNoteModalOpen,
  onRecordingComplete,
}: UseDashboardActionsProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isRecordingModalOpen, setIsRecordingModalOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [referenceNote, setReferenceNote] = useState<VoiceNote | null>(null);
  const { selectedFolderId, fetchNotes, notes } = useNoteManagerStore();

  useEffect(() => {
    if (notes.length > 0 && !referenceNote) {
      setReferenceNote(notes[0]);
    }
  }, [notes, referenceNote]);

  const handleProjectClick = () => {
    setIsProjectModalOpen(true);
    setIsExpanded(false);
  };

  const createNewNote = (): Partial<VoiceNote> => ({
    fileName: null,
    transcription: "",
    tags: [],
    duration: null,
    userId: "",
  });

  const handleCreateNoteClick = () => {
    const newNote = createNewNote();
    setEditingNote(newNote as VoiceNote);
    setIsNoteModalOpen(true);
    setIsExpanded(false);
  };

  const handleRecordClick = () => {
    setIsRecordingModalOpen(true);
    setIsExpanded(false);
  };

  const checkForNewNote = async (): Promise<boolean> => {
    await fetchNotes();
    if (notes.length === 0) return false;

    const latestNote = notes[0];
    if (!referenceNote) return true;

    const isNewNote = latestNote.id !== referenceNote.id;
    if (isNewNote) {
      setReferenceNote(latestNote);
      return true;
    }

    return false;
  };

  const waitForNewNote = () => {
    let intervalId: ReturnType<typeof setInterval> | null = setInterval(async () => {
      const hasNew = await checkForNewNote();
      if (hasNew && intervalId) {
        clearInterval(intervalId);
        intervalId = null;
        onRecordingComplete();
      }
    }, 4000);
  };

  const handleRecordingFinish = () => {
    setIsRecordingModalOpen(false);
    setIsExpanded(false);
    waitForNewNote();
  };

  return {
    isExpanded,
    setIsExpanded,
    isProjectModalOpen,
    setIsProjectModalOpen,
    isRecordingModalOpen,
    setIsRecordingModalOpen,
    isRecording,
    setIsRecording,
    selectedFolderId,
    handleProjectClick,
    handleCreateNoteClick,
    handleRecordClick,
    handleRecordingFinish,
  };
};
