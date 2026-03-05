import Link from "next/link";
import { ArrowRight, BookOpenText, GraduationCap, Layers3 } from "lucide-react";

const PILLARS = [
  {
    title: "Para estudiar y crear mejor gratis",
    subtitle: "Herramientas free o freemium para avanzar sin pagar de mas",
    icon: GraduationCap,
    href: "/estudiantes",
    gradient: "from-blue-600 to-sky-500",
    glow: "rgba(37, 99, 235, 0.18)",
  },
  {
    title: "Por carrera y necesidad",
    subtitle: "Explora herramientas segun tu area",
    icon: BookOpenText,
    href: "/areas",
    gradient: "from-indigo-600 to-violet-500",
    glow: "rgba(99, 102, 241, 0.18)",
  },
  {
    title: "Mas alla de ChatGPT",
    subtitle: "Descubre herramientas utiles para tu dia a dia",
    icon: Layers3,
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
      : "grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 w-full";
  const cardClass =
    variant === "stacked"
      ? "group relative overflow-hidden rounded-2xl p-5 md:p-6 min-h-[158px] transition-colors duration-150"
      : "group relative overflow-hidden rounded-[1.75rem] p-5 md:p-6 min-h-[220px] transition-colors duration-150";
  const iconClass =
    variant === "stacked"
      ? "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br"
      : "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br";
  const titleClass =
    variant === "stacked"
      ? "font-semibold text-slate-900 leading-tight text-base md:text-lg"
      : "font-semibold text-slate-900 leading-tight text-lg md:text-[1.35rem]";
  const subtitleClass = variant === "stacked" ? "text-sm mt-1.5" : "text-sm mt-2 leading-6";
  const iconSize = variant === "stacked" ? "h-6 w-6 text-white" : "h-7 w-7 text-white";

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

            <div className="relative z-10 flex h-full flex-col">
              <div className={`${iconClass} ${pillar.gradient}`}>
                <Icon className={iconSize} />
              </div>

              <div className="mt-5 max-w-[15rem]">
                <p className={titleClass}>{pillar.title}</p>
                <p className={subtitleClass} style={{ color: "rgba(71,85,105,0.85)" }}>
                  {pillar.subtitle}
                </p>
              </div>

              <div
                className="mt-auto inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-slate-50 text-slate-700 transition-transform duration-150 group-hover:translate-x-0.5"
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
