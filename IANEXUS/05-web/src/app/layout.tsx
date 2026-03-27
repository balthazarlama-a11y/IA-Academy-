import type { Metadata } from "next";
import { Newsreader, Public_Sans } from "next/font/google";
import WhatsAppStickyButton from "@/components/layout/whatsapp-sticky-button";
import { buildRootMetadata } from "@/lib/seo";
import "./globals.css";

const publicSans = Public_Sans({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-ui",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-display",
});

export const metadata: Metadata = buildRootMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${publicSans.variable} ${newsreader.variable}`}>
      <body
        className={`min-h-screen bg-[#f5f2ec] text-slate-900 antialiased ${publicSans.className}`}
      >
        {children}
        <WhatsAppStickyButton />
      </body>
    </html>
  );
}
