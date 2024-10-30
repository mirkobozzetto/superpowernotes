import { VoiceNote } from "@prisma/client";
import React from "react";

interface CreateNoteButtonProps {
  isLoading: boolean;
  setEditingNote: (note: Partial<VoiceNote>) => void;
  setIsNoteModalOpen: (isOpen: boolean) => void;
}

export const CreateNoteButton: React.FC<CreateNoteButtonProps> = ({
  isLoading,
  setEditingNote,
  setIsNoteModalOpen,
}) => {
  const handleClick = () => {
    setEditingNote({
      fileName: "",
      transcription: "",
      tags: [],
      duration: 0,
    });
    setIsNoteModalOpen(true);
  };

  return (
    <button
      onClick={handleClick}
      className="bg-white hover:bg-gray-100 px-4 py-2 border rounded-full w-full font-bold transition-colors duration-200"
      disabled={isLoading}
    >
      Create New Note
    </button>
  );
};
