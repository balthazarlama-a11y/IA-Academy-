import Link from "next/link";
import { BookOpen } from "lucide-react";
import HeaderClient from "@/components/layout/header-client";

const NAV_LINKS = [
  { href: "/estudiantes", label: "Estudiantes" },
  { href: "/areas", label: "Áreas" },
  { href: "/dia-a-dia", label: "Día a Día" },
  { href: "/blog", label: "Blog" },
];

export default function Header() {
  return (
    <header className="relative z-50 px-4 pt-3">
      <div className="relative mx-auto w-full max-w-5xl">
        <div
          className="relative overflow-hidden rounded-full"
          style={{
            border: "1px solid rgba(148, 163, 184, 0.24)",
            background: "rgba(255,255,255,0.90)",
            boxShadow: "0 10px 22px rgba(15,23,42,0.08), inset 0 1px 0 rgba(255,255,255,0.8)",
          }}
        >
          <div className="relative z-10 flex items-center justify-between gap-3 px-4 py-3 md:px-5">
            <Link href="/" className="flex items-center gap-3 flex-none">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
                <BookOpen className="h-5 w-5" />
              </div>
              <span
                className="text-base font-semibold tracking-tight"
                style={{ color: "rgba(15,23,42,0.92)" }}
              >
                IA NEXUS
              </span>
            </Link>

            <HeaderClient navLinks={NAV_LINKS} />
          </div>
        </div>
      </div>
    </header>
  );
}
