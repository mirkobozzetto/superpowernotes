"use client";

import { SessionProvider } from "next-auth/react";
import { type ReactNode } from "react";
import { QueryProvider } from "./QueryProvider";

export const ClientProviders = ({ children }: { children: ReactNode }) => {
  return (
    <SessionProvider>
      <QueryProvider>{children}</QueryProvider>
    </SessionProvider>
  );
};
