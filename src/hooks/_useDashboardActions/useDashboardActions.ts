import { VoiceNote } from "@prisma/client";
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
  const intervalRef = useRef<ReturnType<typeof setInterval>>();
  const hasFoundNewNote = useRef(false);

  useEffect(() => {
    if (notes.length > 0 && !referenceNote) {
      setReferenceNote(notes[0]);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
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
    hasFoundNewNote.current = false;
    const checkForNewNote = async () => {
      await fetchNotes();

      if (!notes.length || !referenceNote) return;

      const latestNote = notes[0];
      if (!hasFoundNewNote.current && latestNote.id !== referenceNote.id) {
        hasFoundNewNote.current = true;
        setReferenceNote(latestNote);
        onRecordingComplete();
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      }
    };

    intervalRef.current = setInterval(checkForNewNote, 4000);
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
