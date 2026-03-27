import Link from "next/link";
import { Instagram, Linkedin, Youtube, X } from "lucide-react";

const FOOTER_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/estudiantes", label: "Gratis para estudiantes" },
  { href: "/areas", label: "Areas" },
  { href: "/dia-a-dia", label: "Día a Día" },
  { href: "/blog", label: "Blog" },
] as const;

const SOCIAL_LINKS = [
  {
    href: "https://x.com",
    label: "X",
    icon: X,
  },
  {
    href: "https://instagram.com",
    label: "Instagram",
    icon: Instagram,
  },
  {
    href: "https://youtube.com",
    label: "YouTube",
    icon: Youtube,
  },
  {
    href: "https://linkedin.com",
    label: "LinkedIn",
    icon: Linkedin,
  },
] as const;

export default function Footer() {
  return (
    <footer className="relative z-50 px-4 pb-3">
      <div className="editorial-frame rounded-xl border border-slate-200 bg-white/90 px-5 py-4 shadow-[0_10px_24px_rgba(15,23,42,0.05)] backdrop-blur-sm editorial-surface">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-900 text-white shadow-sm">
                <span className="text-[0.8rem] font-semibold tracking-tight">IA</span>
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-semibold tracking-tight text-slate-900">
                  YourAI
                </span>
                <span className="text-xs text-slate-500">
                  Portada editorial para descubrir IA por area
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {FOOTER_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {SOCIAL_LINKS.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
                >
                  <Icon className="h-4 w-4" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}

