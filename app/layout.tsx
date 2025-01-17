import { cn } from "@chadcn/lib/utils";
import { Footer } from "@src/components/navigation/Footer";
import { Navigation } from "@src/components/navigation/Navigation";
import { ClientProviders } from "@src/providers/ClientProviders";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const afcadFlux = localFont({
  src: "./fonts/AfacadFlux-VariableFont_slnt,wght.ttf",
  variable: "--font-afcad-flux",
  weight: "100 1000",
});

export const metadata: Metadata = {
  title: "Super Power Notes",
  description: "Magical note taking app",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.svg",
  },
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn("flex flex-col min-h-screen pb-16 dots", `${afcadFlux.variable} antialiased`)}
        style={afcadFlux.style}
      >
        <ClientProviders>
          <Navigation />
          <div className="md:mt-16 mt-0">{children}</div>
          <Footer />
        </ClientProviders>
      </body>
    </html>
  );
}
