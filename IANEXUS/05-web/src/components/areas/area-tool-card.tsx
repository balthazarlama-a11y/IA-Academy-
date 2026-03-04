import { memo } from "react";
import Link from "next/link";
import { ExternalLink, BookOpen, BadgeCheck, GraduationCap } from "lucide-react";
import type { Tool, ToolPlan, ToolLevel } from "@/lib/repositories/tools-repo";

const PLAN_CONFIG: Record<ToolPlan, { label: string; color: string; bg: string }> = {
  free:     { label: "Gratis",      color: "rgba(52,211,153,0.9)",  bg: "rgba(52,211,153,0.12)" },
  edu_free: { label: ".edu Gratis", color: "rgba(56,189,248,0.9)",  bg: "rgba(56,189,248,0.12)" },
  freemium: { label: "Freemium",    color: "rgba(251,191,36,0.9)",  bg: "rgba(251,191,36,0.12)" },
  paid:     { label: "Pago",        color: "rgba(148,163,184,0.7)", bg: "rgba(148,163,184,0.08)" },
};

const LEVEL_LABEL: Record<ToolLevel, string> = {
  beginner:     "Principiante",
  intermediate: "Intermedio",
  advanced:     "Avanzado",
  all:          "Todos los niveles",
};

function AreaToolCard({ tool }: { tool: Tool }) {
  const plan = PLAN_CONFIG[tool.plan];
  const accentColor = tool.category.color_accent ?? "#6366f1";

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] p-5 transition-colors duration-150 hover:border-white/20">
      {/* Barra de color superior */}
      <div
        className="absolute top-0 inset-x-0 h-[3px] rounded-t-3xl"
        style={{ background: accentColor, opacity: 0.7 }}
      />

      <div className="relative z-10 flex flex-col h-full gap-3">

        {/* Nombre + badge plan */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-sm font-semibold text-white leading-tight transition-colors duration-150 group-hover:text-blue-100">
            {tool.name}
          </h3>
          <span
            className="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold"
            style={{ color: plan.color, background: plan.bg }}
          >
            {plan.label}
          </span>
        </div>

        {/* Categoría + nivel */}
        <div className="flex flex-wrap gap-1.5">
          <span
            className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
            style={{
              color: accentColor,
              background: `${accentColor}18`,
              border: `1px solid ${accentColor}30`,
            }}
          >
            {tool.category.name}
          </span>
          <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium text-white/50 border border-white/10">
            {LEVEL_LABEL[tool.level]}
          </span>
        </div>

        {/* Descripción */}
        {tool.description && (
          <p className="text-xs text-white/55 line-clamp-2 leading-relaxed">
            {tool.description}
          </p>
        )}

        {/* Badges verificación */}
        <div className="flex items-center gap-3 mt-auto pt-3 border-t border-white/10">
          {tool.verified && (
            <span className="inline-flex items-center gap-1 text-xs text-emerald-400/80">
              <BadgeCheck className="h-3.5 w-3.5" />
              Verificada
            </span>
          )}
          {tool.edu_verified && (
            <span className="inline-flex items-center gap-1 text-xs text-cyan-400/80">
              <GraduationCap className="h-3.5 w-3.5" />
              Plan .edu
            </span>
          )}
        </div>

        {/* CTA — siempre enlaza a /herramientas/[slug] + externo */}
        <div className="mt-2 flex gap-2">
          <Link
            href={`/herramientas/${tool.slug}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-white transition-colors duration-150"
            style={{
              background: `${accentColor}20`,
              border: `1px solid ${accentColor}35`,
              color: accentColor,
            }}
          >
            <BookOpen className="h-3.5 w-3.5" />
            Ver detalle
          </Link>
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-white/50 transition-colors duration-150 hover:text-white"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)" }}
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </article>
  );
}

export default memo(AreaToolCard);
