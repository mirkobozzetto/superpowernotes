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
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import AuthButton from "../auth/AuthButton";

export const Navigation: React.FC = () => {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 h-16",
        "bg-gradient-to-bl from-gray-900/95 to-gray-950/95",
        "backdrop-blur-sm"
      )}
    >
      <div className="relative flex justify-between items-center mx-auto px-3 h-full container">
        {status === "authenticated" && (
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "text-white hover:bg-gray-800 rounded-full"
                    )}
                  >
                    Record
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/dashboard" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "text-white hover:bg-gray-800 rounded-full"
                    )}
                  >
                    Dashboard
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        )}
        <AuthButton />
      </div>
    </nav>
  );
};
