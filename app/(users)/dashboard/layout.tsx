"use client";

import { Sidebar } from "@src/components/dashboard/_sidebar/Sidebar";
import { type ReactNode } from "react";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-4">{children}</div>
      </main>
    </div>
  );
}
