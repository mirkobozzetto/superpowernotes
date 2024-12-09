import type { CreateFolderData } from "@src/services/folderService";
import React, { useCallback, useEffect, useRef, useState } from "react";

type FolderModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (folderData: CreateFolderData) => Promise<void>;
  title?: string;
  initialData?: {
    name: string;
    description: string | null;
  };
};

export const FolderModal: React.FC<FolderModalProps> = ({
  isOpen,
  onClose,
  onSave,
  title,
  initialData,
}) => {
  const [folderData, setFolderData] = useState<CreateFolderData>({
    name: "",
    description: null,
    parentId: null,
  });

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFolderData({
          name: initialData.name,
          description: initialData.description,
          parentId: null,
        });
      } else {
        setFolderData({ name: "", description: null, parentId: null });
      }
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, initialData]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!folderData.name.trim()) {
        alert("Veuillez entrer un nom de projet");
        return;
      }
      await onSave({
        ...folderData,
        name: folderData.name.trim(),
        description: folderData.description?.trim() || null,
      });
      onClose();
    },
    [folderData, onSave, onClose]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFolderData((prev) => ({ ...prev, [name]: value || null }));
    },
    []
  );

  if (!isOpen) return null;

  const isEditMode = !!initialData;

  return (
    <div
      className="z-50 fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white shadow-xl mx-4 p-8 rounded-lg w-full max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-6 font-bold text-2xl text-gray-800">{title || "Create New Project"}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            ref={inputRef}
            type="text"
            name="name"
            value={folderData.name}
            onChange={handleChange}
            placeholder="Nom du projet"
            className="border-gray-300 p-3 border focus:border-transparent rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            name="description"
            value={folderData.description || ""}
            onChange={handleChange}
            placeholder="Description du projet (optionnel)"
            className="border-gray-300 p-3 border focus:border-transparent rounded-lg focus:ring-2 focus:ring-blue-500 h-48 resize-none"
          />
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="border-gray-300 hover:bg-gray-100 px-6 py-2 border rounded-full text-gray-700 transition-colors duration-200"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-full text-white transition-colors duration-200"
            >
              {isEditMode ? "Enregistrer" : "Créer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
