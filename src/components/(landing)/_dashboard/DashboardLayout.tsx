"use client";

import { Sidebar } from "@src/components/dashboard/_sidebar/Sidebar";
import { SidebarTrigger } from "@src/components/dashboard/_sidebar/SidebarTrigger";
import { useSelectedFolder } from "@src/hooks/_useFolder/useSelectedFolder";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { type ReactNode, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

type DashboardLayoutProps = {
  children: ReactNode;
};

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  useSelectedFolder();

  const handleProjectSelect = () => {
    setIsOpen(false);
  };

  const handleOverlayClick = () => {
    setIsOpen(false);
  };

  if (pathname !== "/") {
    return children;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-[calc(100vh-4rem)] mt-16 overflow-hidden bg-background">
        {session && (
          <>
            <div className="hidden md:block">
              <Sidebar />
            </div>
            {isOpen && (
              <div className="md:hidden fixed inset-0 top-16 z-40">
                <div
                  className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"
                  onClick={handleOverlayClick}
                />
                <div className="relative h-full w-[270px] bg-white shadow-xl">
                  <Sidebar onProjectSelect={handleProjectSelect} />
                </div>
              </div>
            )}
            <SidebarTrigger setIsOpen={setIsOpen} />
          </>
        )}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-4">{children}</div>
        </main>
      </div>
    </DndProvider>
  );
};
