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
    <article className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200 p-6 transition-colors duration-150 hover:border-slate-300 hover:bg-white shadow-[0_14px_26px_rgba(15,23,42,0.10)]"
      style={{
        background: "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(248,250,252,0.9) 100%)",
        contain: "layout style paint",
      }}
    >
      {/* Barra de color superior */}
      <div
        className="absolute top-0 inset-x-0 h-1 rounded-t-3xl"
        style={{ background: accentColor, opacity: 0.8 }}
      />

      <div className="relative z-10 flex flex-col h-full gap-4">

        {/* Nombre + badge plan */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold text-slate-900 leading-snug transition-colors duration-150 group-hover:text-slate-900">
            {tool.name}
          </h3>
          <span
            className="shrink-0 rounded-full px-3 py-1 text-xs font-semibold"
            style={{ color: plan.color, background: plan.bg }}
          >
            {plan.label}
          </span>
        </div>

        {/* Categoría + nivel */}
        <div className="flex flex-wrap gap-2">
          <span
            className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium"
            style={{
              color: accentColor,
              background: `${accentColor}18`,
              border: `1px solid ${accentColor}30`,
            }}
          >
            {tool.category.name}
          </span>
          <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium text-slate-600 border border-slate-200">
            {LEVEL_LABEL[tool.level]}
          </span>
        </div>

        {/* Descripción */}
        {tool.description && (
          <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
            {tool.description}
          </p>
        )}

        {/* Badges verificación */}
        <div className="flex items-center gap-4 mt-auto pt-5 border-t border-slate-200">
          {tool.verified && (
            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600">
              <BadgeCheck className="h-4 w-4" />
              Verificada
            </span>
          )}
          {tool.edu_verified && (
            <span className="inline-flex items-center gap-1.5 text-xs text-cyan-600">
              <GraduationCap className="h-4 w-4" />
              Plan .edu
            </span>
          )}
        </div>

        {/* CTA */}
        <div className="mt-2 flex gap-2">
          <Link
            href={`/herramientas/${tool.slug}`}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors duration-150"
            style={{
              background: `${accentColor}22`,
              border: `1px solid ${accentColor}40`,
              color: accentColor,
            }}
          >
            <BookOpen className="h-4 w-4" />
            Ver detalle
          </Link>
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-600 transition-colors duration-150 hover:text-slate-900"
            style={{ background: "rgba(241,245,249,0.92)", border: "1px solid rgba(148, 163, 184, 0.30)" }}
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </article>
  );
}

export default memo(AreaToolCard);

