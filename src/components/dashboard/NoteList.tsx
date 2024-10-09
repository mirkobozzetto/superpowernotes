import { VoiceNote } from "@prisma/client";
import { format, isValid } from "date-fns";
import React from "react";

interface NoteListProps {
  notes: VoiceNote[];
  isLoading: boolean;
  handleNoteClick: (note: VoiceNote) => void;
  setEditingNote: (note: VoiceNote) => void;
  setIsNoteModalOpen: (isOpen: boolean) => void;
  setDeleteNoteId: (id: string) => void;
  setIsDeleteModalOpen: (isOpen: boolean) => void;
}

export const NoteList: React.FC<NoteListProps> = ({
  notes,
  isLoading,
  handleNoteClick,
  setEditingNote,
  setIsNoteModalOpen,
  setDeleteNoteId,
  setIsDeleteModalOpen,
}) => {
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return isValid(date) ? format(date, "PPpp") : "Invalid date";
  };

  return isLoading ? (
    <div className="flex justify-center">
      <p className="inline-block border-gray-100 bg-gray-50 px-4 py-2 border rounded-full text-center text-gray-500 text-sm animate-pulse">
        Loading...
      </p>
    </div>
  ) : (
    <ul className="space-y-4">
      {notes.map((note) => (
        <li
          key={note.id}
          className="shadow-sm p-4 border rounded-2xl cursor-pointer"
          onClick={() => handleNoteClick(note)}
        >
          <h3 className="mb-4 font-bold text-lg">{note.fileName || "Untitled"}</h3>
          <p className="mb-4 text-gray-700">{note.transcription}</p>
          <p className="mb-4 text-gray-500 text-sm">Tags: {note.tags?.join(", ") || ""}</p>
          <p className="mb-4 text-gray-400 text-xs">Created: {formatDate(note.createdAt)}</p>
          <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
            <button
              className="px-3 py-1 border rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                setEditingNote(note);
                setIsNoteModalOpen(true);
              }}
            >
              Edit
            </button>
            <button
              className="px-3 py-1 border rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                setDeleteNoteId(note.id);
                setIsDeleteModalOpen(true);
              }}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};
