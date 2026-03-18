import { BadgeCheck, GraduationCap, Layers3, Sparkles } from "lucide-react";
import type { Tool } from "@/lib/types/tool";

const PLAN_BADGE: Record<Tool["plan"], { label: string; color: string; bg: string; border: string }> = {
  free:     { label: "Gratis",          color: "#059669", bg: "rgba(16,185,129,0.10)", border: "rgba(52,211,153,0.35)" },
  edu_free: { label: "Beneficio estudiantil", color: "#0284c7", bg: "rgba(56,189,248,0.10)", border: "rgba(56,189,248,0.35)" },
  freemium: { label: "Freemium",        color: "#d97706", bg: "rgba(251,191,36,0.12)", border: "rgba(251,191,36,0.40)" },
  paid:     { label: "Pago",            color: "#64748b", bg: "rgba(148,163,184,0.08)", border: "rgba(148,163,184,0.30)" },
};

const LEVEL_LABEL: Record<Tool["level"], string> = {
  beginner: "Principiante",
  intermediate: "Intermedio",
  advanced: "Avanzado",
  all: "Todos los niveles",
};

export default function ToolMetaBadges({ tool }: { tool: Tool }) {
  const planBadge = PLAN_BADGE[tool.plan];
  return (
    <div className="flex flex-wrap gap-2">
      <span
        className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold"
        style={{ color: planBadge.color, background: planBadge.bg, borderColor: planBadge.border }}
      >
        <Sparkles className="h-3.5 w-3.5" />
        {planBadge.label}
      </span>

      <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700">
        <Layers3 className="h-3.5 w-3.5" />
        {LEVEL_LABEL[tool.level]}
      </span>

      <span
        className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs"
        style={{
          borderColor: `${tool.category.color_accent ?? "#6366f1"}55`,
          background: `${tool.category.color_accent ?? "#6366f1"}22`,
          color: tool.category.color_accent ?? "#c7d2fe",
        }}
      >
        {tool.category.name}
      </span>

      {tool.verified ? (
        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300/30 bg-emerald-400/10 px-2.5 py-1 text-xs text-emerald-700">
          <BadgeCheck className="h-3.5 w-3.5" />
          Verificada
        </span>
      ) : null}

      {tool.edu_verified ? (
        <span className="inline-flex items-center gap-1 rounded-full border border-cyan-300/30 bg-cyan-400/10 px-2.5 py-1 text-xs text-cyan-700">
          <GraduationCap className="h-3.5 w-3.5" />
          Verificación académica
        </span>
      ) : null}
    </div>
  );
}

