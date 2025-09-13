import { VoiceNote } from "@prisma/client";
import { noteMoveService } from "@src/services/noteMoveService";
import { useNoteManagerStore } from "@src/stores/noteManagerStore";
import { FolderIcon, Globe } from "lucide-react";
import React, { useState } from "react";

type NoteMoveModalProps = {
  isOpen: boolean;
  onClose: () => void;
  note: VoiceNote;
  onMoveComplete: () => void;
};

export const NoteMoveModal: React.FC<NoteMoveModalProps> = ({
  isOpen,
  onClose,
  note,
  onMoveComplete,
}) => {
  const { rootFolders, subFolders, selectedFolderId, selectFolder } = useNoteManagerStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMove = async (folderId: string | null) => {
    setIsLoading(true);
    setError(null);

    const result = await noteMoveService.moveNote(note.id, folderId);

    if (result.error) {
      setError(result.error.message);
    } else {
      // D'abord changer le dossier sélectionné
      await selectFolder(folderId);
      // Puis terminer l'opération
      onMoveComplete();
      onClose();
    }

    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-900/40 backdrop-blur-md flex items-center justify-center z-50 transition-all duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">Déplacer la note</h2>

        {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

        <div className="space-y-2">
          {!selectedFolderId && (
            <button
              onClick={() => handleMove(null)}
              disabled={isLoading}
              className="w-full text-left p-3 hover:bg-gray-50 rounded-lg flex items-center gap-2 text-gray-400"
            >
              <Globe className="w-4 h-4" />
              <span>Notes principales (emplacement actuel)</span>
            </button>
          )}
          {selectedFolderId && (
            <button
              onClick={() => handleMove(null)}
              disabled={isLoading}
              className="w-full text-left p-3 hover:bg-gray-50 rounded-lg flex items-center gap-2"
            >
              <Globe className="w-4 h-4" />
              <span>Notes principales</span>
            </button>
          )}

          {rootFolders.map((folder) => {
            const isCurrentFolder = selectedFolderId === folder.id;
            return (
              <div key={folder.id} className="space-y-1">
                <button
                  onClick={() => !isCurrentFolder && handleMove(folder.id)}
                  disabled={isLoading || isCurrentFolder}
                  className={`w-full text-left p-3 hover:bg-gray-50 rounded-lg flex items-center gap-2
                    ${isCurrentFolder ? "text-gray-400" : ""}`}
                >
                  <FolderIcon className="w-4 h-4" />
                  <span>
                    {folder.name} {isCurrentFolder && "(emplacement actuel)"}
                  </span>
                </button>

                {subFolders[folder.id]?.map((subFolder) => {
                  const isCurrentSubFolder = selectedFolderId === subFolder.id;
                  return (
                    <button
                      key={subFolder.id}
                      onClick={() => !isCurrentSubFolder && handleMove(subFolder.id)}
                      disabled={isLoading || isCurrentSubFolder}
                      className={`w-full text-left p-3 hover:bg-gray-50 rounded-lg flex items-center gap-2 pl-8
                        ${isCurrentSubFolder ? "text-gray-400" : ""}`}
                    >
                      <FolderIcon className="w-4 h-4" />
                      <span>
                        {subFolder.name} {isCurrentSubFolder && "(emplacement actuel)"}
                      </span>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
