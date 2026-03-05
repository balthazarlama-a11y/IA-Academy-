import type { Metadata } from "next";
import { Inter } from "next/font/google";
import WhatsAppStickyButton from "@/components/layout/whatsapp-sticky-button";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "IA NEXUS — Comunidad IA para estudiantes",
  description:
    "Herramientas de IA verificadas, prompts para Gemini y comunidad activa por área.",
  openGraph: {
    title: "IA NEXUS",
    description: "Herramientas de IA para estudiantes",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={inter.variable}>
      <body className={`antialiased ${inter.className}`}>
        {children}
        <WhatsAppStickyButton />
      </body>
    </html>
  );
}
