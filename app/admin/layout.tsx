"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex">
      <nav className="fixed bg-gradient-to-bl from-gray-900/95 to-gray-950/95 backdrop-blur-sm p-4 w-64 h-[calc(100vh-4rem)]">
        <ul className="space-y-4 mt-8 text-lg text-white/70">
          <li>
            <Link
              href="/admin"
              className={`hover:text-white ${pathname === "/admin" ? "text-white" : ""}`}
            >
              Account Management
            </Link>
          </li>
          <li>
            <Link
              href="/admin/email"
              className={`hover:text-white ${pathname === "/admin/email" ? "text-white" : ""}`}
            >
              Email Management
            </Link>
          </li>
        </ul>
      </nav>

      {/* Main content */}
      <main className="flex-1 ml-64 p-6 h-full">{children}</main>
    </div>
  );
}
