import Link from "next/link";
import { BookOpen, MessageCircle } from "lucide-react";

export default function Header() {
  return (
    <header
      className="relative z-50 rounded-2xl mx-auto max-w-6xl mt-4 mb-4"
      style={{
        background: "rgba(255, 255, 255, 0.06)",
        backdropFilter: "blur(24px) saturate(180%)",
        border: "1px solid rgba(255, 255, 255, 0.12)",
        boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.15)",
      }}
    >
      <div className="flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link href="#" className="flex items-center gap-2">
          <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 text-white">
            <BookOpen className="h-5 w-5" />
          </div>
          <span className="text-sm font-semibold text-white">IA NEXUS</span>
        </Link>

        {/* CTA Button */}
        <Link
          href="https://chat.whatsapp.com/tu-enlace-general"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-white/20"
          style={{
            background: "rgba(255, 255, 255, 0.12)",
            border: "1px solid rgba(255, 255, 255, 0.20)",
            backdropFilter: "blur(12px)",
          }}
        >
          <MessageCircle className="h-4 w-4" />
          Entrar a comunidad
        </Link>
      </div>
    </header>
  );
}
