import type { Metadata } from "next";
import { Inter } from "next/font/google";
import WhatsAppStickyButton from "@/components/layout/whatsapp-sticky-button";
import { buildRootMetadata } from "@/lib/seo";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-inter",
});

export const metadata: Metadata = buildRootMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={inter.variable}>
      <body
        className={`min-h-screen bg-[#f7f4ee] text-slate-900 antialiased ${inter.className}`}
      >
        {children}
        <WhatsAppStickyButton />
      </body>
    </html>
  );
}
