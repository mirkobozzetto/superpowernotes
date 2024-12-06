import type { CreateFolderData } from "@src/services/folderService";
import { folderService } from "@src/services/folderService";
import { useNoteManagerStore } from "@src/stores/noteManagerStore";
import { Folder as FolderIcon, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { ConfirmModal } from "./_modals/ConfirmModal";
import { FolderModal } from "./_modals/FolderModal";

type FolderActionButtonsProps = {
  isLoading: boolean;
};

export const FolderActionButtons: React.FC<FolderActionButtonsProps> = ({ isLoading }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { selectedFolderId, fetchFolders, selectFolder, folders } = useNoteManagerStore();

  const selectedFolder = folders.find((f) => f.id === selectedFolderId);
  const hasSubFolders = folders.some((f) => f.parentId === selectedFolderId);

  const handleSave = async (folderData: CreateFolderData) => {
    try {
      const dataWithParent = selectedFolderId
        ? { ...folderData, parentId: selectedFolderId }
        : folderData;

      const result = await folderService.createFolder(dataWithParent);
      if (result.error) {
        throw new Error(result.error.message);
      }
      await fetchFolders();
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Failed to create folder:", error);
    }
  };

  const handleDelete = async () => {
    if (!selectedFolderId) return;

    try {
      const result = await folderService.deleteFolder(selectedFolderId);
      if (result.error) {
        throw new Error(result.error.message);
      }
      await fetchFolders();

      if (selectedFolder?.parentId) {
        await selectFolder(selectedFolder.parentId);
      } else {
        await selectFolder(null);
      }

      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Failed to delete folder:", error);
    }
  };

  const getCreateButtonText = () => {
    if (!selectedFolderId) return "Create Project";
    return "Create Subproject";
  };

  const getDeleteMessage = () => {
    if (hasSubFolders) {
      return "Are you sure you want to delete this project? All subprojects and their content will be deleted!";
    }
    return "Are you sure you want to delete this project and all its content?";
  };

  return (
    <div className="flex gap-4">
      <button
        onClick={() => setIsCreateModalOpen(true)}
        className="flex items-center justify-center gap-2 bg-white hover:bg-gray-100 px-4 py-2 border rounded-full w-full font-bold transition-colors duration-200"
        disabled={isLoading}
      >
        <FolderIcon className="w-4 h-4" />
        {getCreateButtonText()}
      </button>

      {selectedFolderId && (
        <button
          onClick={() => setIsDeleteModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-white hover:bg-gray-100 px-4 py-2 border rounded-full w-full font-bold text-red-500 transition-colors duration-200"
          disabled={isLoading}
        >
          <Trash2 className="w-4 h-4" />
          Delete {hasSubFolders ? "Project & Subprojects" : "Project"}
        </button>
      )}

      <FolderModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleSave}
        title={`${selectedFolderId ? "Create Subproject" : "Create Project"}`}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title={`Delete ${hasSubFolders ? "Project & Subprojects" : "Project"}`}
        message={getDeleteMessage()}
      />
    </div>
  );
};
