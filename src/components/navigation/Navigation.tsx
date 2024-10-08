"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@chadcn/components/ui/navigation-menu";

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
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Record
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/dashboard" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
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
