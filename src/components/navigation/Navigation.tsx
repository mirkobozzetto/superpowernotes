"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@chadcn/components/ui/navigation-menu";
import { cn } from "@chadcn/lib/utils";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AuthButton from "../auth/AuthButton";

const navigationItems = (isAdmin: boolean) => [
  {
    name: "Dashboard",
    href: "/",
  },
  ...(isAdmin
    ? [
        {
          name: "Admin",
          href: "/admin",
        },
      ]
    : []),
];

export function Navigation() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  if (pathname === "/recorder-embed") {
    return null;
  }

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 h-16",
        "bg-gradient-to-bl from-gray-900/95 to-gray-950/95",
        "backdrop-blur-sm"
      )}
    >
      <div className="relative flex justify-between items-center mx-auto px-3 h-full container">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/SPN.svg"
            alt="Super Power Notes Logo"
            width={64}
            height={64}
            className="size-20"
          />
          <span className="sm:block hidden font-bold text-3xl text-white">Super Power Notes</span>
        </Link>

        <div className="flex items-center">
          {status === "authenticated" && (
            <NavigationMenu>
              <NavigationMenuList>
                {navigationItems(isAdmin).map((item) => (
                  <NavigationMenuItem key={item.href}>
                    <Link href={item.href} legacyBehavior passHref>
                      <NavigationMenuLink
                        className={cn(
                          navigationMenuTriggerStyle(),
                          "text-white transition-colors",
                          "hover:bg-gray-800",
                          pathname === item.href && "bg-gray-800",
                          "rounded-full"
                        )}
                      >
                        {item.name}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          )}
          <AuthButton />
        </div>
      </div>
    </nav>
  );
}
