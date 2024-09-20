import Navigation from "@src/components/navigation/Navigation";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Super Power Notes",
  description: "Magical note taking app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <Navigation />
          <main className="container mx-auto mt-4">{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
