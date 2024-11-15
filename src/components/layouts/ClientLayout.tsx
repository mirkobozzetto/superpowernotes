"use client";

import { cn } from "@chadcn/lib/utils";
import { usePathname } from "next/navigation";

export function ClientLayout({
  children,
  fontVariable,
  style,
}: {
  children: React.ReactNode;
  fontVariable: string;
  style: any;
}) {
  const pathname = usePathname();
  const isRecorderEmbed = pathname?.startsWith("/recorder-embed");

  return (
    <body
      className={cn(
        "flex flex-col min-h-screen dots",
        !isRecorderEmbed && "pb-16",
        `${fontVariable} antialiased`
      )}
      style={style}
    >
      {children}
    </body>
  );
}
