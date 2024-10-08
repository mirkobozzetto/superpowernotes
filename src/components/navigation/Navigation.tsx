"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import AuthButton from "../auth/AuthButton";

export const Navigation: React.FC = () => {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  return (
    <nav className="bg-gradient-to-bl from-gray-900/95 to-gray-950/95 p-3">
      <div className="flex justify-between items-center mx-auto container">
        {status === "authenticated" && (
          <div className="flex space-x-2">
            <NavLink href="/" active={pathname === "/"}>
              Record
            </NavLink>
            <NavLink href="/dashboard" active={pathname === "/dashboard"}>
              Dashboard
            </NavLink>
          </div>
        )}
        <AuthButton />
      </div>
    </nav>
  );
};

interface NavLinkProps {
  href: string;
  active: boolean;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children }) => (
  <Link
    href={href}
    className={`
      text-gray-300 hover:text-white px-3 py-2 rounded-full text-sm font-medium
      transition-colors duration-200 ease-in-out
    `}
  >
    {children}
  </Link>
);
