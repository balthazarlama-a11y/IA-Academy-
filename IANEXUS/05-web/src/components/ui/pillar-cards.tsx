import Link from "next/link";
import { GraduationCap, Layers3, Sparkles } from "lucide-react";

const PILLARS = [
  {
    title: "Gratis para Estudiantes",
    icon: GraduationCap,
    href: "#estudiantes",
    gradientFrom: "from-blue-400",
    gradientTo: "to-cyan-400",
    iconBg: "bg-blue-500/20",
    iconBorder: "border-blue-400/30",
  },
  {
    title: "Áreas y Especialidades",
    icon: Layers3,
    href: "#areas",
    gradientFrom: "from-violet-400",
    gradientTo: "to-fuchsia-400",
    iconBg: "bg-violet-500/20",
    iconBorder: "border-violet-400/30",
  },
  {
    title: "IA del Día a Día",
    icon: Sparkles,
    href: "#dia-a-dia",
    gradientFrom: "from-emerald-400",
    gradientTo: "to-teal-400",
    iconBg: "bg-emerald-500/20",
    iconBorder: "border-emerald-400/30",
  },
];

export default function PillarCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
      {PILLARS.map((pillar) => {
        const Icon = pillar.icon;
        return (
          <Link
            key={pillar.title}
            href={pillar.href}
            className="group relative overflow-hidden flex flex-col items-center justify-center aspect-[4/3] rounded-3xl p-8 transition-all duration-300 hover:scale-[1.04]"
            style={{
              background: "rgba(255, 255, 255, 0.06)",
              backdropFilter: "blur(20px) saturate(160%)",
              border: "1px solid rgba(255, 255, 255, 0.10)",
              boxShadow:
                "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.10)",
            }}
          >
            {/* Top gradient bar */}
            <div
              className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${pillar.gradientFrom} ${pillar.gradientTo}`}
            />

            {/* Icon container */}
            <div
              className={`h-10 w-10 rounded-xl border flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${pillar.iconBg} ${pillar.iconBorder}`}
            >
              <Icon className="h-6 w-6 text-white" />
            </div>

            {/* Text */}
            <span className="font-semibold text-base text-white text-center leading-tight">
              {pillar.title}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
