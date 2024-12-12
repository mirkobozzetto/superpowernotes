import { cn } from "@chadcn/lib/utils";
import { ChevronRight } from "lucide-react";

export const SidebarTrigger = ({ setIsOpen }: { setIsOpen: (isOpen: boolean) => void }) => {
  return (
    <button
      onClick={() => setIsOpen(true)}
      className={cn(
        "md:hidden fixed top-[50vh] -translate-y-1/2 -left-1",
        "flex items-center justify-center w-8 h-16",
        "bg-white border border-l-0 rounded-r-full shadow-lg",
        "transition-all duration-200",
        "hover:bg-gray-50"
      )}
    >
      <ChevronRight className="h-5 w-5" />
    </button>
  );
};
