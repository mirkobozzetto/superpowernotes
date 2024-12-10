import { VoiceNote } from "@prisma/client";
import { format, isValid } from "date-fns";
import { LegacyRef } from "react";
import { useDrag } from "react-dnd";
import { NoteMoveButton } from "./NoteMoveButton";

type DraggableNoteProps = {
  note: VoiceNote;
  handleNoteClick: (note: VoiceNote) => void;
  setEditingNote: (note: VoiceNote) => void;
  setIsNoteModalOpen: (isOpen: boolean) => void;
  setDeleteNoteId: (id: string) => void;
  setIsDeleteModalOpen: (isOpen: boolean) => void;
  isLoading: boolean;
};

export function DraggableNote({
  note,
  handleNoteClick,
  setEditingNote,
  setIsNoteModalOpen,
  setDeleteNoteId,
  setIsDeleteModalOpen,
  isLoading,
}: DraggableNoteProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "NOTE",
    item: { id: note.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return isValid(date) ? format(date, "PPpp") : "Invalid date";
  };

  return (
    <li
      ref={drag as unknown as LegacyRef<HTMLLIElement>}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className="bg-white shadow-md p-4 border rounded-2xl cursor-pointer"
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
          Éditer
        </button>
        <NoteMoveButton
          note={note}
          isLoading={isLoading}
          onMoveComplete={() => {
            const event = new Event("noteMoved");
            window.dispatchEvent(event);
          }}
        />
        <button
          className="px-3 py-1 border rounded-full"
          onClick={(e) => {
            e.stopPropagation();
            setDeleteNoteId(note.id);
            setIsDeleteModalOpen(true);
          }}
        >
          Supprimer
        </button>
      </div>
    </li>
  );
}
