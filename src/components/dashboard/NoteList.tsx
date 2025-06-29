import { VoiceNote } from "@prisma/client";
import { CopyToClipboard } from "@src/components/actions/CopyToClipboard";
import { format, isValid } from "date-fns";
import { fr } from "date-fns/locale";
import React, { useEffect, useRef } from "react";
import { DraggableNoteItem } from "./DraggableNote";
import { NoteMoveButton } from "./NoteMoveButton";

type NoteListProps = {
  notes: VoiceNote[];
  isLoading: boolean;
  isProcessing?: boolean;
  handleNoteClick: (note: VoiceNote) => void;
  setEditingNote: (note: VoiceNote) => void;
  setIsNoteModalOpen: (isOpen: boolean) => void;
  setDeleteNoteId: (id: string) => void;
  setIsDeleteModalOpen: (isOpen: boolean) => void;
  onLoadMore?: (skip: number) => void;
  hasMore?: boolean;
};

export const NoteList: React.FC<NoteListProps> = ({
  notes,
  isLoading,
  isProcessing = false,
  handleNoteClick,
  setEditingNote,
  setIsNoteModalOpen,
  setDeleteNoteId,
  setIsDeleteModalOpen,
  onLoadMore,
  hasMore = false,
}) => {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !isLoading && onLoadMore) {
          onLoadMore(notes.length);
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [notes.length, hasMore, isLoading, onLoadMore]);

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return isValid(date)
      ? format(date, "d MMMM yyyy 'à' HH'h'mm", { locale: fr })
      : "Date invalide";
  };

  if (isLoading && notes.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className={`space-y-4 relative ${isProcessing ? "opacity-50" : ""}`}>
      {isProcessing && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900" />
        </div>
      )}
      <ul className="space-y-4" style={{ marginBottom: "10vh" }}>
        {notes.map((note) => (
          <DraggableNoteItem key={note.id} note={note} onClick={() => handleNoteClick(note)}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-lg">{note.fileName || "Untitled"}</h3>
              <div onClick={(e) => e.stopPropagation()}>
                <CopyToClipboard text={note.transcription} className="!rounded-full" />
              </div>
            </div>
            <p className="mb-4 text-gray-700">{note.transcription}</p>
            <p className="mb-4 text-gray-500 text-sm">Tags: {note.tags?.join(", ") || ""}</p>
            <p className="mb-4 text-gray-400 text-xs">{formatDate(note.createdAt)}</p>
            <div className="flex flex-wrap gap-2" onClick={(e) => e.stopPropagation()}>
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
          </DraggableNoteItem>
        ))}
      </ul>
      {hasMore && (
        <div ref={loadMoreRef} className="h-10 flex items-center justify-center">
          {isLoading && (
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900" />
          )}
        </div>
      )}
    </div>
  );
};
