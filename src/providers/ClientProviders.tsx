"use client";

import { QueryProvider } from "@src/lib/query/providers/QueryProvider";
import { SessionProvider } from "next-auth/react";
import { type ReactNode } from "react";

export const ClientProviders = ({ children }: { children: ReactNode }) => {
  return (
    <SessionProvider>
      <QueryProvider>{children}</QueryProvider>
    </SessionProvider>
  );
};
