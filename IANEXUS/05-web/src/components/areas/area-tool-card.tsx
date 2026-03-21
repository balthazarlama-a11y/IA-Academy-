import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, BookOpen, BadgeCheck, GraduationCap } from "lucide-react";
import type { Tool, ToolPlan, ToolLevel } from "@/lib/repositories/tools-repo";
import { StaffEditButton } from "@/components/staff/staff-edit-button";

const PLAN_CONFIG: Record<ToolPlan, { label: string; color: string; bg: string }> = {
  free: { label: "Gratis", color: "rgba(16,185,129,0.92)", bg: "rgba(16,185,129,0.10)" },
  edu_free: { label: "Beneficio estudiantil", color: "rgba(14,165,233,0.92)", bg: "rgba(14,165,233,0.10)" },
  freemium: { label: "Freemium", color: "rgba(234,179,8,0.95)", bg: "rgba(234,179,8,0.10)" },
  paid: { label: "Pago", color: "rgba(100,116,139,0.92)", bg: "rgba(148,163,184,0.08)" },
};

const LEVEL_LABEL: Record<ToolLevel, string> = {
  beginner: "Principiante",
  intermediate: "Intermedio",
  advanced: "Avanzado",
  all: "Todos los niveles",
};

function AreaToolCard({ tool }: { tool: Tool }) {
  const plan = PLAN_CONFIG[tool.plan];
  const accentColor = tool.category.color_accent ?? "#475569";
  const categorySummary = tool.category.description ?? "Curada para esta carrera y pensada para uso practico.";

  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-150 hover:-translate-y-0.5 hover:border-slate-300 shadow-[0_8px_20px_rgba(15,23,42,0.06)]"
      style={{ contain: "layout style paint" }}
    >
      <div className="absolute inset-x-0 top-0 h-1" style={{ background: accentColor, opacity: 0.82 }} />

      <StaffEditButton
        href={`/admin/tools?q=${encodeURIComponent(tool.slug)}`}
        label={`Editar herramienta "${tool.name}" en Admin`}
        className="absolute right-3 top-3 z-20"
      />

      <div className="relative z-10 flex h-full flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {tool.cover_image_url ? (
              <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <Image
                  src={tool.cover_image_url}
                  alt={`${tool.name} logo`}
                  width={48}
                  height={48}
                  className="h-full w-full object-contain p-0.5"
                />
              </div>
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
                <span className="text-lg font-semibold text-slate-300">
                  {tool.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <span
              className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
              style={{ color: plan.color, background: plan.bg }}
            >
              {plan.label}
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="text-base font-semibold leading-snug text-slate-950 transition-colors duration-150 group-hover:text-slate-900">
            {tool.name}
          </h3>
          {tool.description ? (
            <p className="text-sm leading-relaxed text-slate-600 line-clamp-2">{tool.description}</p>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2">
          <span
            className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium"
            style={{
              color: accentColor,
              background: `${accentColor}12`,
              border: `1px solid ${accentColor}28`,
            }}
          >
            {tool.category.name}
          </span>
          <span className="inline-flex items-center rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600">
            {LEVEL_LABEL[tool.level]}
          </span>
          {tool.ia_type ? (
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-500">
              {tool.ia_type}
            </span>
          ) : null}
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Carrera</p>
          <p className="mt-1 text-sm font-medium text-slate-950 line-clamp-2">{categorySummary}</p>
        </div>

        <div className="flex items-center gap-3 border-t border-slate-200 pt-4 text-xs">
          {tool.verified ? (
            <span className="inline-flex items-center gap-1.5 text-emerald-600">
              <BadgeCheck className="h-4 w-4" />
              Verificada
            </span>
          ) : null}
          {tool.edu_verified ? (
            <span className="inline-flex items-center gap-1.5 text-cyan-600">
              <GraduationCap className="h-4 w-4" />
              Verificacion academica
            </span>
          ) : null}
          {tool.guide_slug ? (
            <span className="ml-auto inline-flex items-center gap-1 rounded-full border border-violet-300/25 bg-violet-400/8 px-2.5 py-1 text-violet-600">
              Guia disponible
            </span>
          ) : null}
        </div>

        <div className="mt-1 flex gap-2">
          <Link
            href={`/herramientas/${tool.slug}`}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors duration-150"
            style={{
              background: `${accentColor}18`,
              border: `1px solid ${accentColor}30`,
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
            className="inline-flex items-center justify-center gap-1.5 rounded-lg px-3.5 py-2.5 text-sm font-semibold text-slate-600 transition-colors duration-150 hover:text-slate-900"
            style={{
              background: "rgba(241,245,249,0.95)",
              border: "1px solid rgba(148,163,184,0.26)",
            }}
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </article>
  );
}

export default memo(AreaToolCard);
