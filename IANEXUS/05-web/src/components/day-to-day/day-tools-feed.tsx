"use client";

import Link from "next/link";
import { ExternalLink, BadgeCheck, GraduationCap } from "lucide-react";
import type { Tool, ToolPlan, ToolLevel } from "@/lib/repositories/tools-repo";
import type { FilterState } from "./day-filter-bar";
import { StaffEditButton } from "@/components/staff/staff-edit-button";

const PLAN_CONFIG: Record<ToolPlan, { label: string; color: string; bg: string }> = {
  free: { label: "Gratis", color: "rgba(52,211,153,0.9)", bg: "rgba(52,211,153,0.12)" },
  edu_free: { label: ".edu", color: "rgba(56,189,248,0.9)", bg: "rgba(56,189,248,0.12)" },
  freemium: { label: "Freemium", color: "rgba(251,191,36,0.9)", bg: "rgba(251,191,36,0.12)" },
  paid: { label: "Pago", color: "rgba(148,163,184,0.7)", bg: "rgba(148,163,184,0.08)" },
};

const LEVEL_LABEL: Record<ToolLevel, string> = {
  beginner: "Principiante",
  intermediate: "Intermedio",
  advanced: "Avanzado",
  all: "Todos",
};

type DayToolsFeedProps = {
  tools: Tool[];
  filters: FilterState;
};

export default function DayToolsFeed({ tools, filters }: DayToolsFeedProps) {
  const filteredTools = tools.filter((tool) => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        tool.name.toLowerCase().includes(searchLower) ||
        (tool.description?.toLowerCase().includes(searchLower) ?? false) ||
        (tool.ia_type?.toLowerCase().includes(searchLower) ?? false);
      if (!matchesSearch) return false;
    }

    // Plan filter
    if (filters.plan !== "all" && tool.plan !== filters.plan) {
      return false;
    }

    // Category filter
    if (filters.category && tool.category.name !== filters.category) {
      return false;
    }

    // Level filter
    if (filters.level !== "all" && tool.level !== filters.level) {
      return false;
    }

    return true;
  });

  if (filteredTools.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <ExternalLink className="mx-auto h-8 w-8 text-slate-300 mb-3" />
        <p className="text-sm text-slate-500">No se encontraron herramientas</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-sm font-medium uppercase tracking-[0.12em] text-slate-500 px-1">
        Herramientas ({filteredTools.length})
      </h2>

      <div className="flex flex-col gap-4">
        {filteredTools.map((tool) => {
          const plan = PLAN_CONFIG[tool.plan];
          const accentColor = tool.category.color_accent ?? "#6366f1";

          return (
            <article
              key={tool.id}
              className="group relative rounded-2xl border border-slate-200 bg-white p-4 transition-colors duration-150 hover:border-slate-300 hover:bg-white"
            >
              <StaffEditButton
                href={`/admin/tools?q=${encodeURIComponent(tool.slug)}`}
                label={`Editar herramienta "${tool.name}" en Admin`}
                className="absolute right-3 top-3 z-10"
              />
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-sm font-medium text-slate-900">{tool.name}</h3>
                <span
                  className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium"
                  style={{ color: plan.color, background: plan.bg }}
                >
                  {plan.label}
                </span>
              </div>

              {/* Category & Level */}
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span
                  className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium"
                  style={{
                    color: accentColor,
                    background: `${accentColor}15`,
                    border: `1px solid ${accentColor}25`,
                  }}
                >
                  {tool.category.name}
                </span>
                <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] text-slate-500">
                  {LEVEL_LABEL[tool.level]}
                </span>
              </div>

              {/* Description */}
              {tool.description && (
                <p className="mt-2 line-clamp-2 text-xs text-slate-500">
                  {tool.description}
                </p>
              )}

              {/* Footer */}
              <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3">
                <div className="flex items-center gap-3">
                  {tool.verified && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400/80">
                      <BadgeCheck className="h-3 w-3" />
                      Verificada
                    </span>
                  )}
                  {tool.edu_verified && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-cyan-400/80">
                      <GraduationCap className="h-3 w-3" />
                      .edu
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/herramientas/${tool.slug}`}
                    className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    Detalle
                  </Link>
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-2 py-1 text-slate-500 transition hover:text-slate-900"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

