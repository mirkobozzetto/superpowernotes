"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex">
      {/* Sidebar */}
      <nav className="fixed bg-gradient-to-bl from-gray-900/95 to-gray-950/95 backdrop-blur-sm p-4 w-64 h-[calc(100vh-4rem)]">
        <ul className="space-y-4 mt-8 text-lg text-white/70">
          <li>
            <Link
              href="/admin"
              className={`hover:text-white ${pathname === "/admin" ? "text-white" : ""}`}
            >
              User Management
            </Link>
          </li>
          <li>
            <Link
              href="/admin/mail"
              className={`hover:text-white ${pathname === "/admin/mail" ? "text-white" : ""}`}
            >
              Emailing
            </Link>
          </li>
          <li>
            <Link
              href="/admin/manage"
              className={`hover:text-white ${pathname === "/admin/manage" ? "text-white" : ""}`}
            >
              Manage
            </Link>
          </li>
        </ul>
      </nav>

      {/* Main content */}
      <main className="flex-1 ml-64 p-6 h-full">{children}</main>
    </div>
  );
}
