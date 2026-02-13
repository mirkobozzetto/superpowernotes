import type { VoiceNote } from "@prisma/client";
import React, { LegacyRef, useEffect } from "react";
import { useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";

type DraggableNoteItemProps = {
  note: VoiceNote;
  onClick: () => void;
  children: React.ReactNode;
};

export const DraggableNoteItem: React.FC<DraggableNoteItemProps> = ({
  note,
  onClick,
  children,
}) => {
  const [{ isDragging }, drag, dragPreview] = useDrag({
    type: "NOTE",
    item: {
      id: note.id,
      type: "NOTE",
      title: note.fileName || "Untitled",
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  useEffect(() => {
    dragPreview(getEmptyImage(), { captureDraggingState: true });
  }, [dragPreview]);

  return (
    <li
      ref={drag as unknown as LegacyRef<HTMLLIElement>}
      className={`bg-white shadow-md p-4 border rounded-2xl cursor-move touch-manipulation ${
        isDragging ? "opacity-50" : ""
      }`}
      onClick={onClick}
    >
      {children}
    </li>
  );
};
