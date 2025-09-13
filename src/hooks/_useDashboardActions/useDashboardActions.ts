import { VoiceNote } from "@prisma/client";
import { voiceNotesService } from "@src/services/voiceNotesService";
import { useNoteManagerStore } from "@src/stores/noteManagerStore";
import { useEffect, useRef, useState } from "react";

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
  const checkingInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const initialNoteId = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (notes.length > 0 && !referenceNote) {
      setReferenceNote(notes[0]);
    }
    return () => {
      if (checkingInterval.current) {
        clearInterval(checkingInterval.current);
      }
    };
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

  const waitForNewNote = () => {
    initialNoteId.current = notes[0]?.id;

    const checkForNewNote = async () => {
      const hasNewNote = await voiceNotesService.checkForNewNoteAfter(initialNoteId.current!);
      if (hasNewNote) {
        if (checkingInterval.current) {
          clearInterval(checkingInterval.current);
        }
        await fetchNotes();
        onRecordingComplete();
      }
    };

    checkingInterval.current = setInterval(checkForNewNote, 5000);
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
