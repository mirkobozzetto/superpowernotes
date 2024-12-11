import { Button } from "@chadcn/components/ui/button";
import { cn } from "@chadcn/lib/utils";
import { noteMoveService } from "@src/services/noteMoveService";
import { useNoteManagerStore } from "@src/stores/noteManagerStore";
import { LegacyRef } from "react";
import { useDrop } from "react-dnd";

type DroppableButtonProps = {
  folderId: string | null;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
};

export const DroppableButton: React.FC<DroppableButtonProps> = ({
  folderId,
  onClick,
  children,
  className,
}) => {
  const { selectFolder } = useNoteManagerStore();

  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: "NOTE",
    drop: async (item: { id: string }) => {
      await noteMoveService.moveNote(item.id, folderId);
      selectFolder(folderId);
      const event = new Event("noteMoved");
      window.dispatchEvent(event);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  return (
    <div
      ref={drop as unknown as LegacyRef<HTMLDivElement>}
      className={cn(
        "relative rounded-lg transition-all duration-200",
        canDrop && "bg-blue-50/50",
        isOver && !canDrop && "bg-red-50/50",
        isOver && canDrop && "bg-blue-100/80 ring-2 ring-blue-400 ring-opacity-60 scale-[1.02]"
      )}
    >
      <Button
        variant="ghost"
        className={cn(
          className,
          "relative transition-transform duration-200",
          isOver && canDrop && "transform translate-x-1"
        )}
        onClick={onClick}
      >
        {children}
      </Button>
      {isOver && canDrop && (
        <div className="absolute inset-0 rounded-lg ring-4 ring-blue-400 ring-opacity-30 animate-pulse" />
      )}
    </div>
  );
};
