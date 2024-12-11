import { FileText } from "lucide-react";
import { useDragLayer } from "react-dnd";

type DragItem = {
  id: string;
  type: string;
  title: string;
};

export const CustomDragPreview = () => {
  const { isDragging, currentOffset, item } = useDragLayer((monitor) => ({
    item: monitor.getItem() as DragItem,
    currentOffset: monitor.getClientOffset(),
    isDragging: monitor.isDragging(),
  }));

  if (!isDragging || !currentOffset || !item) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        pointerEvents: "none",
        zIndex: 100,
        left: currentOffset.x,
        top: currentOffset.y,
        width: "auto",
        transform: "translate(-50%, -50%)",
      }}
      className="bg-white shadow-lg p-2 border-2 border-blue-400 rounded-lg flex items-center gap-2"
    >
      <FileText className="h-4 w-4 text-blue-500" />
      <span className="text-sm font-medium whitespace-nowrap">Déplacer la note</span>
    </div>
  );
};
