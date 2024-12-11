import { cn } from "@chadcn/lib/utils";
import { ChevronRight } from "lucide-react";
import { useDrop } from "react-dnd";

type DragItem = {
  id: string;
  type: "NOTE";
  title: string;
};

export const SidebarTrigger = ({ setIsOpen }: { setIsOpen: (isOpen: boolean) => void }) => {
  const [{ isOverDropZone }, drop] = useDrop<DragItem, void, { isOverDropZone: boolean }>(() => ({
    accept: "NOTE",
    canDrop: () => true,
    collect: (monitor) => ({
      isOverDropZone: monitor.isOver(),
    }),
  }));

  return (
    <button
      onClick={() => setIsOpen(true)}
      className={cn(
        "md:hidden fixed top-[50vh] -translate-y-1/2 -left-1",
        "flex items-center justify-center w-8 h-16",
        "bg-white border border-l-0 rounded-r-full shadow-lg",
        "transition-all duration-200",
        isOverDropZone ? "bg-blue-50 border-blue-200 translate-x-1" : "hover:bg-gray-50"
      )}
    >
      <ChevronRight className={cn("h-5 w-5", isOverDropZone && "text-blue-500")} />
    </button>
  );
};
