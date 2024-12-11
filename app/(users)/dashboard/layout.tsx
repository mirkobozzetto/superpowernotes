"use client";

import { Sidebar } from "@src/components/dashboard/_sidebar/Sidebar";
import { CustomDragPreview } from "@src/components/dashboard/CustomDragPreview";
import { useSelectedFolder } from "@src/hooks/_useFolder/useSelectedFolder";
import { ChevronRight } from "lucide-react";
import { type ReactNode, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isOpen, setIsOpen] = useState(false);
  useSelectedFolder();

  const handleProjectSelect = () => {
    setIsOpen(false);
  };

  const handleOverlayClick = () => {
    setIsOpen(false);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen overflow-hidden bg-background">
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {isOpen && (
          <div className="md:hidden fixed inset-0 z-40">
            <div
              className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"
              onClick={handleOverlayClick}
            />
            <div className="relative h-full w-[300px] bg-white shadow-xl">
              <Sidebar onProjectSelect={handleProjectSelect} />
            </div>
          </div>
        )}

        <div className="md:hidden fixed top-[50vh] -translate-y-1/2 -left-1 z-30">
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center justify-center w-8 h-16 bg-white border border-l-0 rounded-r-full shadow-lg hover:bg-gray-50 transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-4">{children}</div>
        </main>
      </div>
      <CustomDragPreview />
    </DndProvider>
  );
}
