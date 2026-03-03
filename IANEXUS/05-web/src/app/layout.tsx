import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IA NEXUS",
  description:
    "Comunidad informativa de IA con herramientas por área, planes gratuitos y flujos para el día a día.",
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
