import { VoiceNote } from "@prisma/client";
import { useNoteManagerStore } from "@src/stores/noteManagerStore";
import { FileText } from "lucide-react";
import React from "react";

type CreateNoteButtonProps = {
  isLoading: boolean;
  setEditingNote: (note: Partial<VoiceNote>) => void;
  setIsNoteModalOpen: (isOpen: boolean) => void;
};

export const CreateNoteButton: React.FC<CreateNoteButtonProps> = ({
  isLoading,
  setEditingNote,
  setIsNoteModalOpen,
}) => {
  const { selectedFolderId } = useNoteManagerStore();

  const handleClick = () => {
    setEditingNote({
      fileName: "",
      transcription: "",
      tags: [],
      duration: 0,
      ...(selectedFolderId && { folderId: selectedFolderId }),
    });
    setIsNoteModalOpen(true);
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center justify-center gap-2 bg-white hover:bg-gray-100 px-4 py-2 border rounded-full w-full font-bold transition-colors duration-200"
      disabled={isLoading}
    >
      <FileText className="w-4 h-4" />
      Créer une note {selectedFolderId ? "dans le projet" : ""}
    </button>
  );
};
