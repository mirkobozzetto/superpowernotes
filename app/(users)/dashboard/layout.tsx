"use client";

import { Sidebar } from "@src/components/dashboard/_sidebar/Sidebar";
import { SidebarTrigger } from "@src/components/dashboard/_sidebar/SidebarTrigger";
import { CustomDragPreview } from "@src/components/dashboard/CustomDragPreview";
import { useSelectedFolder } from "@src/hooks/_useFolder/useSelectedFolder";
import { type ReactNode, useEffect, useState } from "react";
import { DndProvider, useDragLayer } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";

function useIsTouchDevice() {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  return isTouch;
}

const GlobalDragMonitor = ({ setIsOpen }: { setIsOpen: (isOpen: boolean) => void }) => {
  const { isDragging, item } = useDragLayer((monitor) => ({
    isDragging: monitor.isDragging(),
    item: monitor.getItem(),
  }));

  useEffect(() => {
    if (isDragging && item?.type === "NOTE") {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [isDragging, item, setIsOpen]);

  return null;
};

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isTouch = useIsTouchDevice();
  useSelectedFolder();

  const handleProjectSelect = () => {
    setIsOpen(false);
  };

  const handleOverlayClick = () => {
    setIsOpen(false);
  };

  const backend = isTouch ? TouchBackend : HTML5Backend;

  return (
    <DndProvider backend={backend}>
      <GlobalDragMonitor setIsOpen={setIsOpen} />
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

        <SidebarTrigger setIsOpen={setIsOpen} />

        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-4">{children}</div>
        </main>
      </div>
      <CustomDragPreview />
    </DndProvider>
  );
}
