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
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-2 px-6 py-3.5 md:flex-row md:items-center md:justify-between md:gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm">
            <Sparkles className="h-[18px] w-[18px] text-slate-900" />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              IA NEXUS
            </p>
            <p className="text-[0.92rem] font-medium text-slate-900">Portada editorial de IA</p>
          </div>
        </div>

        <nav className="flex flex-wrap items-center gap-1.5 text-sm text-slate-600 md:justify-center">
          {navItems.map((item, index) => {
            const Icon = [Sparkles, BookOpen, GraduationCap, Layers3, Search][index] ?? BookOpen;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex items-center gap-2 rounded-full border border-transparent px-2.5 py-1.5 transition-colors hover:border-slate-200 hover:bg-white hover:text-slate-900"
              >
                <Icon className="h-3 w-3" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            Iniciar sesion
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center rounded-full bg-slate-950 px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
          >
            Leer portada
          </Link>
        </div>
      </div>
    </header>
  );
}
