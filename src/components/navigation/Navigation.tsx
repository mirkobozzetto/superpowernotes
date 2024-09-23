"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AuthButton from "../auth/AuthButton";

export default function Navigation() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        {status === "authenticated" && (
          <div className="flex space-x-4">
            <Link href="/" className={`text-white ${pathname === "/" ? "font-bold" : ""}`}>
              Record
            </Link>
            <Link
              href="/dashboard"
              className={`text-white ${pathname === "/dashboard" ? "font-bold" : ""}`}
            >
              Dashboard
            </Link>
          </div>
        )}
        <AuthButton />
      </div>
    </nav>
  );
}
