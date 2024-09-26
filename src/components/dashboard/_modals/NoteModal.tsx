import { VoiceNote } from "@prisma/client";
import React, { useCallback, useEffect, useState } from "react";
import TagInput from "../TagInput";

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: Partial<VoiceNote>) => void;
  note?: VoiceNote;
}

export const NoteModal: React.FC<NoteModalProps> = ({ isOpen, onClose, onSave, note }) => {
  const [editedNote, setEditedNote] = useState<Partial<VoiceNote>>({
    fileName: "",
    transcription: "",
    tags: [],
  });

  useEffect(() => {
    if (isOpen) {
      if (note) {
        setEditedNote(note);
      } else {
        setEditedNote({ fileName: "", transcription: "", tags: [] });
      }
    }
  }, [isOpen, note]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onSave(editedNote);
      onClose();
    },
    [editedNote, onSave, onClose]
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
      setEditedNote((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleTagsChange = useCallback((newTags: string[]) => {
    setEditedNote((prev) => ({ ...prev, tags: newTags }));
  }, []);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white p-8 rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {note ? "Edit Note" : "Create New Note"}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="text"
            name="fileName"
            value={editedNote.fileName ?? ""}
            onChange={handleChange}
            placeholder="File Name"
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <textarea
            name="transcription"
            value={editedNote.transcription ?? ""}
            onChange={handleChange}
            placeholder="Transcription"
            className="border border-gray-300 p-3 rounded-lg h-48 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <TagInput tags={editedNote.tags ?? []} onChange={handleTagsChange} />
          <div className="flex justify-end mt-6 space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
