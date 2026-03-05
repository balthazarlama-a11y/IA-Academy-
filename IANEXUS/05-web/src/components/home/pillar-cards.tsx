import Link from "next/link";
import { ArrowRight, GraduationCap, Layers3, Sparkles } from "lucide-react";

const PILLARS = [
  {
    title: "Gratis para Estudiantes",
    subtitle: "Herramientas verificadas sin costo",
    icon: GraduationCap,
    href: "/estudiantes",
    gradient: "from-blue-600 to-sky-500",
    glow: "rgba(37, 99, 235, 0.18)",
  },
  {
    title: "Areas y Especialidades",
    subtitle: "IA por carrera y disciplina",
    icon: Layers3,
    href: "/areas",
    gradient: "from-indigo-600 to-violet-500",
    glow: "rgba(99, 102, 241, 0.18)",
  },
  {
    title: "IA del Día a Día",
    subtitle: "Fundamentales para tareas variadas",
    icon: Sparkles,
    href: "/dia-a-dia",
    gradient: "from-emerald-600 to-teal-500",
    glow: "rgba(5, 150, 105, 0.18)",
  },
];

type PillarCardsProps = {
  variant?: "stacked" | "grid";
};

export default function PillarCards({ variant = "grid" }: PillarCardsProps) {
  const containerClass =
    variant === "stacked"
      ? "grid grid-cols-1 gap-4 w-full max-w-[27rem]"
      : "grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 w-full max-w-3xl";
  const cardClass =
    variant === "stacked"
      ? "group relative overflow-hidden rounded-2xl p-5 md:p-6 min-h-[158px] transition-colors duration-150"
      : "group relative overflow-hidden rounded-2xl p-4 transition-colors duration-150";
  const iconClass =
    variant === "stacked"
      ? "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br"
      : "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br";
  const titleClass = variant === "stacked" ? "font-semibold text-slate-900 leading-tight text-base md:text-lg" : "font-semibold text-slate-900 leading-tight text-sm md:text-base";
  const subtitleClass = variant === "stacked" ? "text-sm mt-1.5" : "text-xs mt-1";
  const iconSize = variant === "stacked" ? "h-6 w-6 text-white" : "h-5 w-5 text-white";

  return (
    <div className={containerClass}>
      {PILLARS.map((pillar) => {
        const Icon = pillar.icon;

        return (
          <Link
            key={pillar.title}
            href={pillar.href}
            className={cardClass}
            style={{
              border: "1px solid rgba(148, 163, 184, 0.24)",
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.94) 0%, rgba(248,250,252,0.92) 100%)",
              boxShadow: `0 14px 24px rgba(15,23,42,0.08), 0 0 0 1px rgba(255,255,255,0.5), 0 0 12px ${pillar.glow}`,
              touchAction: "manipulation",
              contain: "layout paint style",
            }}
          >
            <div
              className={`absolute top-0 inset-x-0 h-[2px] rounded-t-2xl bg-gradient-to-r ${pillar.gradient}`}
            />

            <div className="relative z-10 flex items-center gap-3">
              <div className={`${iconClass} ${pillar.gradient}`}>
                <Icon className={iconSize} />
              </div>

              <div>
                <p className={titleClass}>
                  {pillar.title}
                </p>
                <p className={subtitleClass} style={{ color: "rgba(71,85,105,0.85)" }}>
                  {pillar.subtitle}
                </p>
              </div>

              <div
                className="ml-auto inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-slate-50 text-slate-700 transition-transform duration-150 group-hover:translate-x-0.5"
                aria-hidden="true"
              >
                <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" />
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

