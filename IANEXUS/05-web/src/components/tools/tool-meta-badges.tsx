import { BadgeCheck, GraduationCap, Layers3, Sparkles } from "lucide-react";
import type { Tool } from "@/lib/types/tool";

const PLAN_LABEL: Record<Tool["plan"], string> = {
  free: "Gratis",
  edu_free: "Pack Estudiante",
  freemium: "Freemium",
  paid: "Pago",
};

const LEVEL_LABEL: Record<Tool["level"], string> = {
  beginner: "Principiante",
  intermediate: "Intermedio",
  advanced: "Avanzado",
  all: "Todos los niveles",
};

export default function ToolMetaBadges({ tool }: { tool: Tool }) {
  return (
    <div className="flex flex-wrap gap-2">
      <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-xs text-white/80">
        <Sparkles className="h-3.5 w-3.5" />
        {PLAN_LABEL[tool.plan]}
      </span>

      <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/7 px-2.5 py-1 text-xs text-white/70">
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
        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300/30 bg-emerald-400/10 px-2.5 py-1 text-xs text-emerald-200">
          <BadgeCheck className="h-3.5 w-3.5" />
          Verificada
        </span>
      ) : null}

      {tool.edu_verified ? (
        <span className="inline-flex items-center gap-1 rounded-full border border-cyan-300/30 bg-cyan-400/10 px-2.5 py-1 text-xs text-cyan-200">
          <GraduationCap className="h-3.5 w-3.5" />
          .edu verificado
        </span>
      ) : null}
    </div>
  );
}
