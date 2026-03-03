import Link from "next/link";
import { GraduationCap, Layers3, Sparkles } from "lucide-react";

const PILLARS = [
  {
    title: "Gratis para Estudiantes",
    subtitle: "Herramientas verificadas sin costo",
    icon: GraduationCap,
    href: "/estudiantes",
    gradient: "from-blue-400 to-cyan-400",
    glow: "rgba(59, 130, 246, 0.30)",
  },
  {
    title: "Áreas y Especialidades",
    subtitle: "IA por carrera y disciplina",
    icon: Layers3,
    href: "/areas",
    gradient: "from-violet-400 to-fuchsia-400",
    glow: "rgba(139, 92, 246, 0.30)",
  },
  {
    title: "IA del Día a Día",
    subtitle: "Gemas Gemini por especialidad",
    icon: Sparkles,
    href: "/dia-a-dia",
    gradient: "from-emerald-400 to-teal-400",
    glow: "rgba(16, 185, 129, 0.30)",
  },
];

export default function PillarCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-3xl">
      {PILLARS.map((pillar) => {
        const Icon = pillar.icon;
        return (
          <Link
            key={pillar.title}
            href={pillar.href}
            className="group relative overflow-hidden flex flex-col items-start justify-between rounded-[28px] p-7 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
            style={{
              minHeight: "220px",
              border: "1px solid rgba(255, 255, 255, 0.45)",
              boxShadow: `0 8px 40px ${pillar.glow}, 0 2px 8px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.65)`,
            }}
          >
            {/* Capa 1: distorsión liquid glass */}
            <div
              className="absolute inset-0 z-0 rounded-[inherit] overflow-hidden"
              style={{
                backdropFilter: "blur(24px) saturate(180%)",
                filter: "url(#glass-distortion)",
                isolation: "isolate",
              }}
            />
            {/* Capa 2: blanco translúcido */}
            <div
              className="absolute inset-0 z-10 rounded-[inherit]"
              style={{ background: "rgba(255, 255, 255, 0.18)" }}
            />
            {/* Capa 3: highlight top-left */}
            <div
              className="absolute inset-0 z-20 rounded-[inherit]"
              style={{
                boxShadow:
                  "inset 1.5px 1.5px 0 rgba(255,255,255,0.70), inset -1px -1px 0 rgba(255,255,255,0.20)",
              }}
            />

            {/* Top gradient line */}
            <div
              className={`absolute top-0 inset-x-0 h-[3px] rounded-t-[28px] bg-gradient-to-r ${pillar.gradient} z-30`}
            />

            {/* Icon — top left */}
            <div
              className={`relative z-30 flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${pillar.gradient} shadow-lg transition-transform duration-300 group-hover:scale-110`}
            >
              <Icon className="h-7 w-7 text-white" />
            </div>

            {/* Text + arrow — pinned to bottom */}
            <div className="relative z-30 flex items-end justify-between w-full gap-2">
              <div>
                <p className="font-bold text-lg text-white leading-tight">
                  {pillar.title}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.55)" }}>
                  {pillar.subtitle}
                </p>
              </div>
              {/* Arrow */}
              <div
                className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-full transition-transform duration-300 group-hover:translate-x-1"
                style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.30)" }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7h10M7 2l5 5-5 5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
