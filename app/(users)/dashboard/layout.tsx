"use client";

import { Sidebar } from "@src/components/dashboard/_sidebar/Sidebar";
import { SidebarTrigger } from "@src/components/dashboard/_sidebar/SidebarTrigger";
import { CustomDragPreview } from "@src/components/dashboard/CustomDragPreview";
import { useSelectedFolder } from "@src/hooks/_useFolder/useSelectedFolder";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { DndProvider, useDragLayer } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";

const isTouchDevice = () => {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
};

const simulateDragEvent = (event: MouseEvent | Touch) => {
  const dragEndEvent = new MouseEvent("mouseup", {
    clientX: event.clientX,
    clientY: event.clientY,
    bubbles: true,
  });
  document.dispatchEvent(dragEndEvent);

  setTimeout(() => {
    const dragStartEvent = new MouseEvent("mousedown", {
      clientX: event.clientX,
      clientY: event.clientY,
      bubbles: true,
    });
    document.dispatchEvent(dragStartEvent);
  }, 250);
};

const GlobalDragMonitor = ({ setIsOpen }: { setIsOpen: (isOpen: boolean) => void }) => {
  const lastEventRef = useRef<{ x: number; y: number } | null>(null);
  const { isDragging, item, currentOffset } = useDragLayer((monitor) => ({
    isDragging: monitor.isDragging(),
    item: monitor.getItem(),
    currentOffset: monitor.getClientOffset(),
  }));

  useEffect(() => {
    const handleDragEvent = (event: MouseEvent | TouchEvent) => {
      if (isDragging && item?.type === "NOTE") {
        const eventData = "touches" in event ? event.touches[0] : event;
        lastEventRef.current = { x: eventData.clientX, y: eventData.clientY };
      }
    };

    window.addEventListener("mousemove", handleDragEvent);
    window.addEventListener("touchmove", handleDragEvent);

    return () => {
      window.removeEventListener("mousemove", handleDragEvent);
      window.removeEventListener("touchmove", handleDragEvent);
    };
  }, [isDragging, item]);

  useEffect(() => {
    if (isDragging && item?.type === "NOTE") {
      setIsOpen(true);
      if (lastEventRef.current) {
        simulateDragEvent({
          clientX: lastEventRef.current.x,
          clientY: lastEventRef.current.y,
        } as MouseEvent);
      }
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
  useSelectedFolder();

  const handleProjectSelect = () => {
    setIsOpen(false);
  };

  const handleOverlayClick = () => {
    setIsOpen(false);
  };

  const backend = isTouchDevice() ? TouchBackend : HTML5Backend;

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
