"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AuthButton from "../auth/AuthButton";

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex space-x-4">
          <Link href="/" className={`text-white ${pathname === "/" ? "font-bold" : ""}`}>
            Home
          </Link>
          <Link
            href="/dashboard"
            className={`text-white ${pathname === "/dashboard" ? "font-bold" : ""}`}
          >
            Dashboard
          </Link>
        </div>
        <AuthButton />
      </div>
    </nav>
  );
}
