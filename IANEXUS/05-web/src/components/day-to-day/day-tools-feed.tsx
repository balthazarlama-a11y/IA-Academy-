"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink, BadgeCheck, GraduationCap, ArrowUpRight, Sparkles } from "lucide-react";
import type { Tool, ToolPlan, ToolLevel } from "@/lib/repositories/tools-repo";
import type { FilterState } from "./day-filter-bar";
import { StaffEditButton } from "@/components/staff/staff-edit-button";

const PLAN_CONFIG: Record<ToolPlan, { label: string; color: string; bg: string }> = {
  free: { label: "Gratis", color: "rgba(52,211,153,0.9)", bg: "rgba(52,211,153,0.12)" },
  edu_free: { label: "Beneficio estudiantil", color: "rgba(56,189,248,0.9)", bg: "rgba(56,189,248,0.12)" },
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
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        tool.name.toLowerCase().includes(searchLower) ||
        (tool.description?.toLowerCase().includes(searchLower) ?? false) ||
        (tool.ia_type?.toLowerCase().includes(searchLower) ?? false) ||
        (tool.primaryArea?.name.toLowerCase().includes(searchLower) ?? false);
      if (!matchesSearch) return false;
    }

    if (filters.plan !== "all" && tool.plan !== filters.plan) {
      return false;
    }

    if (filters.category && (tool.primaryArea?.name ?? "Área general") !== filters.category) {
      return false;
    }

    if (filters.level !== "all" && tool.level !== filters.level) {
      return false;
    }

    return true;
  });

  if (filteredTools.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200/80 bg-white p-5 text-center shadow-sm">
        <ExternalLink className="mx-auto mb-3 h-8 w-8 text-slate-300" />
        <p className="text-sm text-slate-500">No hay tools que coincidan con este filtro.</p>
        <p className="mt-1 text-xs text-slate-400">Cambia categoría, nivel o plan para abrir el feed.</p>
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-end justify-between gap-3 px-1">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Tools</p>
          <h2 className="mt-1 text-xl font-semibold tracking-[-0.02em] text-slate-950">
            Descubrimiento práctico
          </h2>
        </div>
        <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-500">
          {filteredTools.length} resultados
        </span>
      </div>

      <div className="flex flex-col gap-4">
        {filteredTools.map((tool) => {
          const plan = PLAN_CONFIG[tool.plan];
          const accentColor = tool.primaryArea?.color_accent ?? "#6366f1";

          return (
            <article
              key={tool.id}
            className="group relative overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-[0_10px_28px_rgba(15,23,42,0.04)] transition duration-200 hover:-translate-y-0.5 hover:border-slate-300"
            >
              <StaffEditButton
                href={`/admin/tools?q=${encodeURIComponent(tool.slug)}`}
                label={`Editar herramienta "${tool.name}" en Admin`}
                className="absolute right-3 top-3 z-10"
              />

              <div className="grid gap-0 lg:grid-cols-[0.88fr_1.12fr]">
                <div className="relative min-h-[160px] overflow-hidden bg-slate-50">
                  {tool.cover_image_url ? (
                    <Image
                      src={tool.cover_image_url}
                      alt={tool.name}
                      fill
                      unoptimized
                      loading="lazy"
                      className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div
                      className="flex min-h-[160px] items-center justify-center"
                      style={{
                        background: `radial-gradient(circle at top, ${accentColor}20, transparent 52%), linear-gradient(160deg, rgba(248,250,252,1), rgba(255,255,255,1))`,
                      }}
                    >
                      <div
                        className="rounded-[20px] border bg-white/90 p-4 shadow-sm"
                        style={{ borderColor: `${accentColor}22`, color: accentColor }}
                      >
                        <Sparkles className="h-7 w-7" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex min-w-0 flex-1 flex-col gap-3.5 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span
                          className="inline-flex items-center rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-[0.14em]"
                          style={{
                            color: accentColor,
                            background: `${accentColor}14`,
                            border: `1px solid ${accentColor}24`,
                          }}
                        >
                          {tool.primaryArea?.name ?? "Área general"}
                        </span>
                        <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-slate-500">
                          {LEVEL_LABEL[tool.level]}
                        </span>
                      </div>

                      <h3 className="text-[1.02rem] font-semibold tracking-[-0.02em] text-slate-950">
                        {tool.name}
                      </h3>
                    </div>
                    <span
                      className="shrink-0 rounded-full px-2.5 py-1 text-[10px] font-medium"
                      style={{ color: plan.color, background: plan.bg }}
                    >
                      {plan.label}
                    </span>
                  </div>

                  {tool.description ? (
                    <p className="line-clamp-2 text-sm leading-6 text-slate-600">
                      {tool.description}
                    </p>
                  ) : (
                    <p className="text-sm leading-6 text-slate-500">
                      Herramienta curada para resolver una tarea concreta del día.
                    </p>
                  )}

                  <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-200 pt-4">
                    <div className="flex flex-wrap items-center gap-2">
                      {tool.verified && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] text-emerald-700">
                          <BadgeCheck className="h-3 w-3" />
                          Verificada
                        </span>
                      )}
                      {tool.edu_verified && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-[10px] text-cyan-700">
                          <GraduationCap className="h-3 w-3" />
                          Verificación académica
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/herramientas/${tool.slug}`}
                        className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                      >
                        Detalle
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                      <a
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
