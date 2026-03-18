import Link from "next/link";
import { BookOpen, GraduationCap, Layers3, Search, Sparkles } from "lucide-react";

const navItems = [
  { label: "Inicio", href: "/" },
  { label: "Blog", href: "/blog" },
  { label: "Estudiantes", href: "/estudiantes" },
  { label: "Areas", href: "/areas" },
  { label: "Dia a dia", href: "/dia-a-dia" },
];

export default function EditorialTopbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-[#f7f1e9]/90 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 py-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
            <Sparkles className="h-5 w-5 text-slate-900" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              IA NEXUS
            </p>
            <p className="text-sm font-medium text-slate-900">Portada editorial de IA</p>
          </div>
        </div>

        <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
          {navItems.map((item, index) => {
            const Icon = [Sparkles, BookOpen, GraduationCap, Layers3, Search][index] ?? BookOpen;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex items-center gap-2 rounded-full border border-transparent px-3 py-2 transition-colors hover:border-slate-200 hover:bg-white hover:text-slate-900"
              >
                <Icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            Iniciar sesion
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
          >
            Leer portada
          </Link>
        </div>
      </div>
    </header>
  );
}
