import type { Folder } from "@prisma/client";
import { folderService } from "@src/services/folderService";
import { useNoteManagerStore } from "@src/stores/noteManagerStore";
import { FolderDown, FolderPlus, Pencil, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { ConfirmModal } from "./ConfirmModal";
import { FolderModal } from "./FolderModal";

type ProjectManagementModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const ProjectManagementModal: React.FC<ProjectManagementModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreateSubModalOpen, setIsCreateSubModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { selectedFolderId, folders, fetchFolders, selectFolder } = useNoteManagerStore();

  const selectedFolder = folders.find((f) => f.id === selectedFolderId);

  const handleCreate = async (folderData: Pick<Folder, "name" | "description">) => {
    const result = await folderService.createFolder(folderData);
    if (!result.error) {
      await fetchFolders();
      setIsCreateModalOpen(false);
      onClose();
    }
  };

  const handleCreateSub = async (folderData: Pick<Folder, "name" | "description">) => {
    if (!selectedFolderId) return;

    const result = await folderService.createFolder({
      ...folderData,
      parentId: selectedFolderId,
    });
    if (!result.error) {
      await fetchFolders();
      setIsCreateSubModalOpen(false);
      onClose();
    }
  };

  const handleEdit = async (folderData: Pick<Folder, "name" | "description">) => {
    if (!selectedFolderId) return;

    const result = await folderService.updateFolder(selectedFolderId, folderData);
    if (!result.error) {
      await fetchFolders();
      setIsEditModalOpen(false);
      onClose();
    }
  };

  const handleDelete = async () => {
    if (selectedFolderId) {
      const result = await folderService.deleteFolder(selectedFolderId);
      if (!result.error) {
        await selectFolder(null);
        await fetchFolders();
        setIsDeleteModalOpen(false);
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="z-50 fixed inset-0 flex justify-center items-center bg-gray-900/40 backdrop-blur-md transition-all duration-200"
        onClick={onClose}
      >
        <div
          className="bg-white shadow-xl mx-4 p-8 rounded-lg w-full max-w-xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="mb-6 font-bold text-2xl text-gray-800">Gestion des Projets</h2>

          <div className="flex flex-col space-y-4">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors w-full text-left"
            >
              <FolderPlus className="w-5 h-5" />
              <div>
                <div className="font-semibold">Nouveau projet</div>
                <div className="text-sm text-gray-500">Créer un nouveau projet principal</div>
              </div>
            </button>

            {selectedFolder && (
              <>
                <button
                  onClick={() => setIsCreateSubModalOpen(true)}
                  className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors w-full text-left"
                >
                  <FolderDown className="w-5 h-5" />
                  <div>
                    <div className="font-semibold">Nouveau sous-projet</div>
                    <div className="text-sm text-gray-500">
                      Créer un sous-projet dans &quot;{selectedFolder.name}&quot;
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors w-full text-left"
                >
                  <Pencil className="w-5 h-5" />
                  <div>
                    <div className="font-semibold">Modifier le projet</div>
                    <div className="text-sm text-gray-500">
                      Modifier le nom ou la description de &quot;{selectedFolder.name}&quot;
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors w-full text-left text-red-500"
                >
                  <Trash2 className="w-5 h-5" />
                  <div>
                    <div className="font-semibold">Supprimer le projet</div>
                    <div className="text-sm">
                      Supprimer &quot;{selectedFolder.name}&quot; et son contenu
                    </div>
                  </div>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {isCreateModalOpen && (
        <FolderModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSave={handleCreate}
          title="Nouveau projet"
        />
      )}

      {isCreateSubModalOpen && (
        <FolderModal
          isOpen={isCreateSubModalOpen}
          onClose={() => setIsCreateSubModalOpen(false)}
          onSave={handleCreateSub}
          title={`Nouveau sous-projet dans "${selectedFolder?.name}"`}
        />
      )}

      {isEditModalOpen && (
        <FolderModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleEdit}
          title={`Modifier "${selectedFolder?.name}"`}
          initialData={selectedFolder}
        />
      )}

      {isDeleteModalOpen && (
        <ConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
          title="Supprimer le projet"
          message={`Êtes-vous sûr de vouloir supprimer "${selectedFolder?.name}" et tout son contenu ? Cette action est irréversible.`}
        />
      )}
    </>
  );
};
