import Link from "next/link";
import { BookOpen, MessageCircle } from "lucide-react";

export default function Header() {
  return (
    <header
      className="relative z-50 rounded-full mx-auto mt-5 mb-2 overflow-hidden w-fit flex-shrink-0"
      style={{
        border: "1px solid rgba(255, 255, 255, 0.45)",
        boxShadow: "0 8px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.65)",
      }}
    >
      {/* Capa 1: distorsión liquid glass */}
      <div
        className="absolute inset-0 z-0 rounded-[inherit]"
        style={{
          backdropFilter: "blur(24px) saturate(180%)",
          filter: "url(#glass-distortion)",
          isolation: "isolate",
        }}
      />
      {/* Capa 2: blanco translúcido */}
      <div
        className="absolute inset-0 z-10 rounded-[inherit]"
        style={{ background: "rgba(255, 255, 255, 0.28)" }}
      />
      {/* Capa 3: highlight interno */}
      <div
        className="absolute inset-0 z-20 rounded-[inherit]"
        style={{
          boxShadow:
            "inset 1.5px 1.5px 0 rgba(255,255,255,0.70), inset -1px -1px 0 rgba(255,255,255,0.20)",
        }}
      />

      <div className="relative z-30 flex items-center gap-8 px-5 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 flex-none">
          <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 text-white flex-shrink-0">
            <BookOpen className="h-5 w-5" />
          </div>
          <span className="text-base font-semibold tracking-tight" style={{ color: "rgba(255,255,255,0.92)" }}>IA NEXUS</span>
        </Link>

        {/* Nav Links (hidden on mobile) */}
        <nav className="hidden md:flex gap-10 items-center">
          <Link
            href="/estudiantes"
            className="text-sm font-medium transition-colors hover:opacity-100"
            style={{ color: "rgba(255,255,255,0.70)" }}
          >
            Estudiantes
          </Link>
          <Link
            href="/areas"
            className="text-sm font-medium transition-colors hover:opacity-100"
            style={{ color: "rgba(255,255,255,0.70)" }}
          >
            Áreas
          </Link>
          <Link
            href="/dia-a-dia"
            className="text-sm font-medium transition-colors hover:opacity-100"
            style={{ color: "rgba(255,255,255,0.70)" }}
          >
            Día a Día
          </Link>
        </nav>

        {/* CTA Button */}
        <Link
          href="https://chat.whatsapp.com/tu-enlace-general"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:brightness-125 flex-none"
          style={{
            background: "rgba(9, 9, 15, 0.80)",
            border: "1px solid rgba(255,255,255,0.15)",
          }}
        >
          <MessageCircle className="h-4 w-4" />
          Entrar
        </Link>
      </div>
    </header>
  );
}
