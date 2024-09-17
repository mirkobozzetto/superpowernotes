import { VoiceNote } from "@prisma/client";
import { format } from "date-fns";
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

const NoteList: React.FC<NoteListProps> = ({
  notes,
  isLoading,
  handleNoteClick,
  setEditingNote,
  setIsNoteModalOpen,
  setDeleteNoteId,
  setIsDeleteModalOpen,
}) =>
  isLoading ? (
    <div className="text-center">Loading...</div>
  ) : (
    <ul className="space-y-4">
      {notes.map((note) => (
        <li
          key={note.id}
          className="border rounded-lg p-4 shadow-sm cursor-pointer"
          onClick={() => handleNoteClick(note)}
        >
          <h3 className="font-bold text-lg mb-2">{note.fileName || "Untitled"}</h3>
          <p className="text-gray-700 mb-2">{note.transcription}</p>
          <p className="text-sm text-gray-500 mb-2">Tags: {note.tags.join(", ")}</p>
          <p className="text-xs text-gray-400 mb-2">
            Created: {format(new Date(note.createdAt), "PPpp")}
          </p>
          <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
            <button
              className="border py-1 px-3 rounded"
              onClick={(e) => {
                e.stopPropagation();
                setEditingNote(note);
                setIsNoteModalOpen(true);
              }}
            >
              Edit
            </button>
            <button
              className="border py-1 px-3 rounded"
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

export default NoteList;
