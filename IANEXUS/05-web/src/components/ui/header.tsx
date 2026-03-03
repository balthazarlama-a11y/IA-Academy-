import Link from "next/link";
import { BookOpen, MessageCircle } from "lucide-react";

export default function Header() {
  return (
    <header
      className="relative z-50 rounded-[20px] mx-auto max-w-6xl mt-4 mb-4 overflow-hidden"
      style={{
        background: "rgba(255, 255, 255, 0.30)",
        backdropFilter: "blur(20px) saturate(160%)",
        border: "1px solid rgba(255, 255, 255, 0.50)",
        boxShadow:
          "inset 0 1px 0 rgba(255, 255, 255, 0.70), 0 4px 20px rgba(0, 0, 0, 0.15)",
        filter: "url(#glass-distortion)",
      }}
    >
      <div className="flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 text-white">
            <BookOpen className="h-5 w-5" />
          </div>
          <span className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.90)" }}>IA NEXUS</span>
        </Link>

        {/* Nav Links (hidden on mobile) */}
        <nav className="hidden md:flex gap-6 items-center">
          <Link
            href="/estudiantes"
            className="text-sm font-medium transition-colors"
            style={{ color: "rgba(255,255,255,0.65)" }}
          >
            Estudiantes
          </Link>
          <Link
            href="/areas"
            className="text-sm font-medium transition-colors"
            style={{ color: "rgba(255,255,255,0.65)" }}
          >
            Áreas
          </Link>
          <Link
            href="/dia-a-dia"
            className="text-sm font-medium transition-colors"
            style={{ color: "rgba(255,255,255,0.65)" }}
          >
            Día a Día
          </Link>
        </nav>

        {/* CTA Button */}
        <Link
          href="https://chat.whatsapp.com/tu-enlace-general"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold text-white transition-all duration-300 hover:brightness-110"
          style={{
            background: "#09090f",
          }}
        >
          <MessageCircle className="h-4 w-4" />
          Entrar
        </Link>
      </div>
    </header>
  );
}
