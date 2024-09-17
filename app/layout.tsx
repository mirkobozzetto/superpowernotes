import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Voice Powered Notes",
  description: "A note taking app with voice input",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
