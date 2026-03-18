import { memo } from "react";
import Link from "next/link";
import { ExternalLink, BookOpen, BadgeCheck, GraduationCap } from "lucide-react";
import type { Tool, ToolPlan, ToolLevel } from "@/lib/repositories/tools-repo";
import { StaffEditButton } from "@/components/staff/staff-edit-button";

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
  const categorySummary =
    tool.category.description ?? "Curada para esta especialidad y pensada para uso practico.";

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[28px] border border-slate-200 p-6 transition-all duration-150 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white shadow-[0_14px_26px_rgba(15,23,42,0.10)]"
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

      <StaffEditButton
        href={`/admin/tools?q=${encodeURIComponent(tool.slug)}`}
        label={`Editar herramienta "${tool.name}" en Admin`}
        className="absolute right-4 top-4 z-20"
      />

      <div className="relative z-10 flex h-full flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          {tool.cover_image_url ? (
            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <img
                src={tool.cover_image_url}
                alt={`${tool.name} logo`}
                className="h-full w-full object-contain p-2"
                loading="lazy"
              />
            </div>
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
              <span className="text-xl font-bold text-slate-300">
                {tool.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

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
          {tool.ia_type ? (
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-500">
              {tool.ia_type}
            </span>
          ) : null}
          {tool.featured ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-300/40 bg-amber-400/10 px-3 py-1 text-xs font-medium text-amber-700">
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              Destacada
            </span>
          ) : null}
        </div>

        {tool.description && (
          <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
            {tool.description}
          </p>
        )}

        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Lectura rapida</p>
          <p className="mt-1 text-sm font-medium text-slate-900">{categorySummary}</p>
        </div>

        <div className="flex items-center gap-3 mt-auto pt-5 border-t border-slate-200">
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
          {tool.guide_slug && (
            <span className="ml-auto inline-flex items-center gap-1 rounded-full border border-violet-300/30 bg-violet-400/8 px-2.5 py-1 text-xs text-violet-600">
              Tiene guía
            </span>
          )}
        </div>

        <div className="mt-2 flex gap-2">
          <Link
            href={`/herramientas/${tool.slug}`}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition-colors duration-150"
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

