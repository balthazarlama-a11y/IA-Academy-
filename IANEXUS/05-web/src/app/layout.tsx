import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  );
}
