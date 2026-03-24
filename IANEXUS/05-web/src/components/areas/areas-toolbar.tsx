"use client";

import { useMemo, useState } from "react";
import { BadgeCheck, Layers3, Search, Sparkles, X } from "lucide-react";
import AreaToolsGrid from "@/components/areas/area-tools-grid";
import AreasEmptyState from "@/components/areas/areas-empty-state";
import type { Tool, ToolArea, ToolLevel, ToolPlan, ToolUseCase } from "@/lib/types/tool";

const PLAN_OPTIONS: Array<{ value: ToolPlan; label: string }> = [
  { value: "free", label: "Gratis" },
  { value: "edu_free", label: "Beneficio estudiantil" },
  { value: "freemium", label: "Freemium" },
  { value: "paid", label: "Pago" },
];

const LEVEL_OPTIONS: Array<{ value: ToolLevel; label: string }> = [
  { value: "all", label: "Todos los niveles" },
  { value: "beginner", label: "Principiante" },
  { value: "intermediate", label: "Intermedio" },
  { value: "advanced", label: "Avanzado" },
];

function normalizeText(value: string | null | undefined) {
  return (value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function toggleItem<T>(items: T[], item: T) {
  return items.includes(item) ? items.filter((value) => value !== item) : [...items, item];
}

export default function AreasToolbar({ initialTools, areas, useCases }: { initialTools: Tool[]; areas: ToolArea[]; useCases: ToolUseCase[] }) {
  const [search, setSearch] = useState("");
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [selectedUseCases, setSelectedUseCases] = useState<string[]>([]);
  const [selectedPlans, setSelectedPlans] = useState<ToolPlan[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<ToolLevel[]>([]);

  const filteredTools = useMemo(() => {
    const normalizedSearch = normalizeText(search);

    return initialTools.filter((tool) => {
      if (selectedAreas.length > 0 && !tool.areas.some((area) => selectedAreas.includes(area.slug))) {
        return false;
      }
      if (selectedUseCases.length > 0 && !tool.useCases.some((useCase) => selectedUseCases.includes(useCase.slug))) {
        return false;
      }
      if (selectedPlans.length > 0 && !selectedPlans.includes(tool.plan)) {
        return false;
      }
      if (selectedLevels.length > 0 && !selectedLevels.includes(tool.level)) {
        return false;
      }
      if (!normalizedSearch) return true;

      const haystack = normalizeText([
        tool.name,
        tool.description,
        tool.tagline,
        tool.company_name,
        tool.ia_type,
        tool.areas.map((area) => area.name).join(" "),
        tool.useCases.map((useCase) => useCase.name).join(" "),
        tool.feature_bullets.join(" "),
      ].filter(Boolean).join(" "));

      return haystack.includes(normalizedSearch);
    });
  }, [initialTools, search, selectedAreas, selectedUseCases, selectedPlans, selectedLevels]);

  const hasSelections = Boolean(search.trim() || selectedAreas.length || selectedUseCases.length || selectedPlans.length || selectedLevels.length);

  const chips = [
    ...selectedAreas.map((slug) => ({ key: `area-${slug}`, label: areas.find((item) => item.slug === slug)?.name ?? slug, remove: () => setSelectedAreas((current) => current.filter((item) => item !== slug)) })),
    ...selectedUseCases.map((slug) => ({ key: `use-${slug}`, label: useCases.find((item) => item.slug === slug)?.name ?? slug, remove: () => setSelectedUseCases((current) => current.filter((item) => item !== slug)) })),
    ...selectedPlans.map((plan) => ({ key: `plan-${plan}`, label: PLAN_OPTIONS.find((item) => item.value === plan)?.label ?? plan, remove: () => setSelectedPlans((current) => current.filter((item) => item !== plan)) })),
    ...selectedLevels.map((level) => ({ key: `level-${level}`, label: LEVEL_OPTIONS.find((item) => item.value === level)?.label ?? level, remove: () => setSelectedLevels((current) => current.filter((item) => item !== level)) })),
  ];

  return (
    <section className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/92 shadow-[0_16px_44px_rgba(15,23,42,0.06)] backdrop-blur-sm">
      <div className="border-b border-slate-200/80 bg-[linear-gradient(180deg,rgba(248,243,234,0.78)_0%,rgba(255,255,255,0.94)_100%)] px-5 py-5 md:px-6 md:py-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="max-w-3xl">
              <p className="inline-flex items-center gap-2 rounded-full border border-amber-300/40 bg-amber-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-800">
                <Sparkles className="h-3.5 w-3.5" />
                Exploración curada
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">Filtra por área y caso de uso.</h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">La taxonomía pública ahora separa contexto profesional de intención real de uso. Primero eliges área. Luego aterrizas el caso de uso.</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs text-slate-600 shadow-[0_8px_20px_rgba(15,23,42,0.04)]"><span className="font-semibold text-slate-950">{filteredTools.length}</span> herramientas visibles</div>
          </div>

          <label className="group relative block">
            <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Buscar</span>
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Ej.: investigar papers, programar, salud, video..." className="w-full rounded-[1.1rem] border border-slate-300/80 bg-white px-11 py-3.5 text-sm text-slate-950 shadow-[0_8px_24px_rgba(15,23,42,0.04)] outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-200/50" />
            </div>
          </label>

          {hasSelections ? (
            <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50/80 px-3 py-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700"><BadgeCheck className="h-3.5 w-3.5 text-slate-500" />Filtros activos</span>
              {chips.map((chip) => (
                <button key={chip.key} type="button" onClick={chip.remove} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"><span>{chip.label}</span><span aria-hidden="true" className="text-slate-400">×</span></button>
              ))}
              {search.trim() ? <button type="button" onClick={() => setSearch("")} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-100">Búsqueda: {search.trim()} <span aria-hidden="true" className="text-slate-400">×</span></button> : null}
              <button type="button" onClick={() => { setSearch(""); setSelectedAreas([]); setSelectedUseCases([]); setSelectedPlans([]); setSelectedLevels([]); }} className="ml-auto inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"><X className="h-3.5 w-3.5" />Limpiar todo</button>
            </div>
          ) : null}
        </div>
      </div>

      <div className="grid gap-6 px-5 py-5 md:px-6 xl:grid-cols-[1.05fr_0.95fr] xl:gap-5">
        <div className="space-y-5">
          <div>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Áreas principales</p>
                <h3 className="mt-1 text-lg font-semibold text-slate-950">Escoge el contexto profesional.</h3>
              </div>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {areas.map((area) => {
                const selected = selectedAreas.includes(area.slug);
                const accentColor = area.color_accent ?? "#475569";
                return (
                  <button key={area.slug} type="button" onClick={() => setSelectedAreas((current) => toggleItem(current, area.slug))} className={`group relative flex min-h-[8.25rem] flex-col items-start overflow-hidden rounded-2xl border p-4 text-left transition-all duration-150 ${selected ? "border-slate-950/10 bg-slate-950/3 shadow-[0_16px_32px_rgba(15,23,42,0.08)]" : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_14px_28px_rgba(15,23,42,0.06)]"}`} style={{ boxShadow: selected ? `0 18px 32px ${accentColor}12` : undefined }}>
                    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl border text-sm font-semibold" style={{ color: accentColor, background: `${accentColor}10`, borderColor: `${accentColor}24` }}>{area.name.charAt(0).toUpperCase()}</div>
                    <span className="block text-base font-semibold text-slate-950">{area.name}</span>
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600">{area.description ?? "Área principal para descubrir herramientas con criterio."}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-xl border border-slate-200 bg-[linear-gradient(180deg,rgba(248,250,252,0.95)_0%,rgba(255,255,255,0.92)_100%)] p-4 shadow-[0_8px_16px_rgba(15,23,42,0.03)]">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="inline-flex items-center gap-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-500"><Layers3 className="h-3 w-3 text-sky-500" />Casos de uso</p>
                <h3 className="mt-0.5 text-sm font-semibold text-slate-950">Aterriza la intención.</h3>
              </div>
              <span className="text-[11px] text-slate-500 whitespace-nowrap">{selectedUseCases.length > 0 ? `${selectedUseCases.length} activos` : "Todos"}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {useCases.map((useCase) => {
                const selected = selectedUseCases.includes(useCase.slug);
                return <button key={useCase.slug} type="button" onClick={() => setSelectedUseCases((current) => toggleItem(current, useCase.slug))} className={`inline-flex items-center rounded-full border px-2.5 py-1.5 text-xs font-medium transition ${selected ? "border-slate-950 bg-slate-950 text-white shadow-[0_6px_14px_rgba(15,23,42,0.1)]" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"}`}>{useCase.name}</button>;
              })}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <div className="rounded-xl border border-slate-200 bg-[linear-gradient(180deg,rgba(248,250,252,0.95)_0%,rgba(255,255,255,0.92)_100%)] p-3 shadow-[0_8px_16px_rgba(15,23,42,0.03)]">
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-500">Acceso</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {PLAN_OPTIONS.map((option) => {
                  const selected = selectedPlans.includes(option.value);
                  return <button key={option.value} type="button" onClick={() => setSelectedPlans((current) => toggleItem(current, option.value))} className={`inline-flex items-center rounded-full border px-2.5 py-1.5 text-xs font-medium transition ${selected ? "border-slate-950 bg-slate-950 text-white shadow-[0_6px_14px_rgba(15,23,42,0.1)]" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"}`}>{option.label}</button>;
                })}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-[linear-gradient(180deg,rgba(248,250,252,0.95)_0%,rgba(255,255,255,0.92)_100%)] p-3 shadow-[0_8px_16px_rgba(15,23,42,0.03)]">
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-500">Nivel</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {LEVEL_OPTIONS.map((option) => {
                  const selected = selectedLevels.includes(option.value);
                  return <button key={option.value} type="button" onClick={() => setSelectedLevels((current) => toggleItem(current, option.value))} className={`inline-flex items-center rounded-full border px-2.5 py-1.5 text-xs font-medium transition ${selected ? "border-slate-950 bg-slate-950 text-white shadow-[0_6px_14px_rgba(15,23,42,0.1)]" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"}`}>{option.label}</button>;
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 px-5 py-5 md:px-6 md:pb-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Resultados</p>
              <h3 className="mt-1 text-lg font-semibold text-slate-950">Herramientas disponibles</h3>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700">{selectedAreas.length > 0 ? `${selectedAreas.length} áreas` : "Todas las áreas"}</span>
          </div>

          {filteredTools.length > 0 ? (
            <AreaToolsGrid tools={filteredTools} isLoading={false} hasMore={false} isLoadingMore={false} onLoadMore={() => undefined} />
          ) : (
            <AreasEmptyState hasFilters={hasSelections} onReset={hasSelections ? () => { setSearch(""); setSelectedAreas([]); setSelectedUseCases([]); setSelectedPlans([]); setSelectedLevels([]); } : undefined} />
          )}
        </div>
      </div>
    </section>
  );
}
