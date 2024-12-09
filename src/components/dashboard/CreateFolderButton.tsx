import type { Folder } from "@prisma/client";
import { FolderModal } from "@src/components/dashboard/_modals/FolderModal";
import { useNoteManagerStore } from "@src/stores/noteManagerStore";
import { FolderPlus } from "lucide-react";
import React, { useState } from "react";

type CreateFolderButtonProps = {
  isLoading: boolean;
};

export const CreateFolderButton: React.FC<CreateFolderButtonProps> = ({ isLoading }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const createFolder = useNoteManagerStore((state) => state.createFolder);

  const handleSave = async (folderData: Pick<Folder, "name" | "description">) => {
    await createFolder(folderData);
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center justify-center gap-2 bg-white hover:bg-gray-100 px-4 py-2 border rounded-full w-full font-bold transition-colors duration-200"
        disabled={isLoading}
      >
        <FolderPlus className="w-4 h-4" />
        Créer un projet
      </button>

      <FolderModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} />
    </>
  );
};
