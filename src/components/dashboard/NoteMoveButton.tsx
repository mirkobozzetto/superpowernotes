import { VoiceNote } from "@prisma/client";
import { FolderCog } from "lucide-react";
import React, { useState } from "react";
import { NoteMoveModal } from "./_modals/NoteMoveModal";

type NoteMoveButtonProps = {
  note: VoiceNote;
  isLoading: boolean;
  onMoveComplete: () => void;
};

export const NoteMoveButton: React.FC<NoteMoveButtonProps> = ({
  note,
  isLoading,
  onMoveComplete,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsModalOpen(true);
        }}
        className="px-3 py-1 border rounded-full flex items-center gap-2"
        disabled={isLoading}
      >
        <FolderCog className="w-4 h-4" />
        Déplacer
      </button>

      <NoteMoveModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        note={note}
        onMoveComplete={onMoveComplete}
      />
    </>
  );
};
