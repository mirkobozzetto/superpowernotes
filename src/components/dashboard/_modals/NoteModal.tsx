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
    if (note) {
      setEditedNote(note);
    } else {
      setEditedNote({ fileName: "", transcription: "", tags: [] });
    }
  }, [note]);

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
      } else if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
        event.preventDefault();
        handleSubmit(event as unknown as React.FormEvent);
      }
    },
    [onClose, handleSubmit]
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
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="bg-white p-6 rounded-2xl w-full max-w-4xl h-5/6 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">{note ? "Edit Note" : "Create New Note"}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col h-full space-y-2">
          <input
            type="text"
            name="fileName"
            value={editedNote.fileName ?? ""}
            onChange={handleChange}
            placeholder="File Name"
            className="border p-2 mb-2 w-full rounded-full"
          />
          <textarea
            name="transcription"
            value={editedNote.transcription ?? ""}
            onChange={handleChange}
            placeholder="Transcription"
            className="border p-2 mb-2 w-full flex-grow resize-none rounded-lg"
          />
          <TagInput tags={editedNote.tags ?? []} onChange={handleTagsChange} />
          <div className="flex justify-end mt-4">
            <button type="button" onClick={onClose} className="mr-2 px-4 py-2 border rounded-full">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 border rounded-full">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
