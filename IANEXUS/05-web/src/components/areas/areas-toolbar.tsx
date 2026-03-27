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

const AREA_DISPLAY_LABELS: Record<string, string> = {
  salud: "Salud",
  programacion: "Programación",
  ingenieria: "Ingeniería",
  diseno: "Diseño",
  derecho: "Derecho",
  negocios: "Negocios",
};

const USE_CASE_DISPLAY_LABELS: Record<string, string> = {
  resumir: "Resumir",
  "buscar-investigar": "Buscar e investigar",
  "generar-contenido-creativo": "Generar contenido creativo",
  "programar-depurar": "Programar y depurar",
  "estudiar-practicar": "Estudiar y practicar",
  "organizar-automatizar": "Organizar y automatizar",
};

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

function getAreaDisplayName(area: ToolArea) {
  return AREA_DISPLAY_LABELS[area.slug] ?? area.name;
}

function getUseCaseDisplayName(useCase: ToolUseCase) {
  return USE_CASE_DISPLAY_LABELS[useCase.slug] ?? useCase.name;
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
    ...selectedAreas.map((slug) => ({ key: `area-${slug}`, label: getAreaDisplayName(areas.find((item) => item.slug === slug) ?? { id: "", name: slug, slug, description: null, color_accent: null, icon_name: null, sort_order: 0 }), remove: () => setSelectedAreas((current) => current.filter((item) => item !== slug)) })),
    ...selectedUseCases.map((slug) => ({ key: `use-${slug}`, label: getUseCaseDisplayName(useCases.find((item) => item.slug === slug) ?? { id: "", name: slug, slug, description: null, color_accent: null, icon_name: null, sort_order: 0 }), remove: () => setSelectedUseCases((current) => current.filter((item) => item !== slug)) })),
    ...selectedPlans.map((plan) => ({ key: `plan-${plan}`, label: PLAN_OPTIONS.find((item) => item.value === plan)?.label ?? plan, remove: () => setSelectedPlans((current) => current.filter((item) => item !== plan)) })),
    ...selectedLevels.map((level) => ({ key: `level-${level}`, label: LEVEL_OPTIONS.find((item) => item.value === level)?.label ?? level, remove: () => setSelectedLevels((current) => current.filter((item) => item !== level)) })),
  ];

  return (
    <section className="overflow-hidden rounded-[1.5rem] ui-shell">
      <div className="border-b ui-rule bg-[linear-gradient(180deg,rgba(247,243,236,0.8)_0%,rgba(255,255,255,0.95)_100%)] px-4 py-4 md:px-6 md:py-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="max-w-3xl">
              <p className="inline-flex items-center gap-2 rounded-full border border-slate-300/50 bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-700">
                <Sparkles className="h-3.5 w-3.5" />
                Exploración curada
              </p>
              <h2 className="ui-title mt-3 text-[2rem] leading-[0.98] text-slate-950 md:text-[3.1rem]">Filtra por área y caso de uso.</h2>
              <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-slate-600 md:text-sm">La taxonomía pública ahora separa contexto profesional de intención real de uso. Primero eliges área. Luego aterrizas el caso de uso.</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-300/70 bg-white px-3 py-1.5 text-[11px] text-slate-600 shadow-[0_6px_14px_rgba(17,24,39,0.04)] md:px-4 md:py-2 md:text-xs"><span className="font-semibold text-slate-950">{filteredTools.length}</span> herramientas visibles</div>
          </div>

          <label className="group relative block">
            <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Buscar</span>
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Ej: investigar papers, programar, salud, video..." className="ui-input w-full rounded-[1rem] px-11 py-3 text-sm shadow-[0_8px_20px_rgba(17,24,39,0.04)] outline-none transition md:py-3.5" />
            </div>
          </label>

          {hasSelections ? (
            <div className="flex flex-wrap items-center gap-2 rounded-[1rem] border ui-rule bg-[rgba(250,249,247,0.92)] px-3 py-3">
              <span className="ui-chip inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium"><BadgeCheck className="h-3.5 w-3.5 text-slate-500" />Filtros activos</span>
              {chips.map((chip) => (
                <button key={chip.key} type="button" onClick={chip.remove} className="ui-chip inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition hover:border-slate-400 hover:bg-slate-50"><span>{chip.label}</span><span aria-hidden="true" className="text-slate-400">×</span></button>
              ))}
              {search.trim() ? <button type="button" onClick={() => setSearch("")} className="ui-chip inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition hover:border-slate-400 hover:bg-slate-50">Búsqueda: {search.trim()} <span aria-hidden="true" className="text-slate-400">×</span></button> : null}
              <button type="button" onClick={() => { setSearch(""); setSelectedAreas([]); setSelectedUseCases([]); setSelectedPlans([]); setSelectedLevels([]); }} className="ml-auto inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"><X className="h-3.5 w-3.5" />Limpiar todo</button>
            </div>
          ) : null}
        </div>
      </div>

      <div className="grid items-stretch gap-5 px-4 py-4 md:px-6 md:py-5 xl:grid-cols-[1.08fr_0.92fr] xl:gap-6">
        <div className="space-y-5">
          <div>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="ui-label">Áreas principales</p>
                <h3 className="mt-1 text-lg font-semibold text-slate-950">Escoge el contexto profesional.</h3>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 md:hidden">
              {areas.map((area) => {
                const selected = selectedAreas.includes(area.slug);
                const accentColor = area.color_accent ?? "#475569";
                const areaLabel = getAreaDisplayName(area);
                return (
                  <button
                    key={area.slug}
                    type="button"
                    onClick={() => setSelectedAreas((current) => toggleItem(current, area.slug))}
                    className={`flex min-h-[4.75rem] flex-col items-start justify-between rounded-[0.95rem] border px-2.5 py-2.5 text-left transition ${
                      selected
                        ? "border-slate-900/20 bg-slate-50 shadow-[0_10px_18px_rgba(17,24,39,0.08)]"
                        : "border-slate-300/70 bg-white"
                    }`}
                    style={{ boxShadow: selected ? `0 14px 22px ${accentColor}12` : undefined }}
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-[0.75rem] border text-[12px] font-semibold" style={{ color: accentColor, background: `${accentColor}10`, borderColor: `${accentColor}24` }}>
                      {areaLabel.charAt(0).toUpperCase()}
                    </div>
                    <div className="w-full">
                      <span className="block text-[12px] font-semibold leading-tight text-slate-950">{areaLabel}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-3 hidden auto-rows-fr gap-2.5 md:grid md:grid-cols-2 xl:grid-cols-3">
              {areas.map((area) => {
                const selected = selectedAreas.includes(area.slug);
                const accentColor = area.color_accent ?? "#475569";
                const areaLabel = getAreaDisplayName(area);
                return (
                  <button key={area.slug} type="button" onClick={() => setSelectedAreas((current) => toggleItem(current, area.slug))} className={`group relative flex h-full min-h-[7.8rem] flex-col items-start overflow-hidden rounded-[0.95rem] border px-3 py-2.5 text-left transition-all duration-150 md:rounded-[1rem] md:px-3.5 md:py-3 ${selected ? "border-slate-900/16 bg-slate-50 shadow-[0_12px_22px_rgba(17,24,39,0.06)]" : "border-slate-300/70 bg-white hover:-translate-y-0.5 hover:border-slate-400 hover:shadow-[0_10px_18px_rgba(17,24,39,0.05)]"}`} style={{ boxShadow: selected ? `0 14px 24px ${accentColor}0F` : undefined }}>
                    <div className="mb-2 flex h-7 w-7 items-center justify-center rounded-[0.75rem] border text-[12px] font-semibold md:h-8 md:w-8 md:rounded-[0.8rem] md:text-[13px]" style={{ color: accentColor, background: `${accentColor}10`, borderColor: `${accentColor}24` }}>{areaLabel.charAt(0).toUpperCase()}</div>
                    <span className="block text-[0.92rem] font-semibold tracking-[-0.01em] text-slate-950 md:text-[0.98rem]">{areaLabel}</span>
                    <p className="mt-1 line-clamp-2 max-w-[18ch] text-[12px] leading-5.5 text-slate-600 md:text-[12.5px]">{area.description ?? "Área principal para descubrir herramientas con criterio."}</p>
                    <span className={`mt-auto inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium transition ${selected ? "border-slate-900/12 bg-slate-900 text-white" : "border-slate-300/60 bg-transparent text-slate-500"}`}>{selected ? "Activa" : "Elegir"}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid content-start auto-rows-fr gap-3">
          <div className="rounded-[1rem] border border-slate-300/70 bg-[linear-gradient(180deg,rgba(250,249,247,0.96)_0%,rgba(255,255,255,0.96)_100%)] p-3.5 shadow-[0_8px_16px_rgba(17,24,39,0.03)] md:p-4 xl:min-h-[15.8rem]">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="inline-flex items-center gap-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-500"><Layers3 className="h-3 w-3 text-sky-500" />Casos de uso</p>
                <h3 className="mt-0.5 text-sm font-semibold text-slate-950">Aterriza la intención.</h3>
              </div>
              <span className="text-[11px] text-slate-500 whitespace-nowrap">{selectedUseCases.length > 0 ? `${selectedUseCases.length} activos` : "Todos"}</span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-1.5 md:gap-2">
              {useCases.map((useCase) => {
                const selected = selectedUseCases.includes(useCase.slug);
                return <button key={useCase.slug} type="button" onClick={() => setSelectedUseCases((current) => toggleItem(current, useCase.slug))} className={`inline-flex min-h-[2.45rem] items-center justify-center rounded-[0.85rem] border px-2 py-1.5 text-center text-[11px] font-medium leading-tight transition md:min-h-[2.45rem] md:rounded-[0.9rem] md:px-3 md:py-1.5 md:text-[12.5px] ${selected ? "border-slate-950 bg-slate-950 text-white shadow-[0_6px_14px_rgba(17,24,39,0.1)]" : "border-slate-300/70 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"}`}>{getUseCaseDisplayName(useCase)}</button>;
              })}
            </div>
          </div>

          <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-1">
            <div className="rounded-[1rem] border border-slate-300/70 bg-[linear-gradient(180deg,rgba(250,249,247,0.96)_0%,rgba(255,255,255,0.96)_100%)] p-3 shadow-[0_8px_16px_rgba(17,24,39,0.03)] xl:min-h-[4.9rem]">
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-500">Acceso</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {PLAN_OPTIONS.map((option) => {
                  const selected = selectedPlans.includes(option.value);
                  return <button key={option.value} type="button" onClick={() => setSelectedPlans((current) => toggleItem(current, option.value))} className={`inline-flex items-center rounded-full border px-3 py-1.5 text-[12px] font-medium transition md:px-3.5 md:py-1.5 md:text-[12px] ${selected ? "border-slate-950 bg-slate-950 text-white shadow-[0_6px_14px_rgba(17,24,39,0.1)]" : "border-slate-300/70 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"}`}>{option.label}</button>;
                })}
              </div>
            </div>

            <div className="rounded-[1rem] border border-slate-300/70 bg-[linear-gradient(180deg,rgba(250,249,247,0.96)_0%,rgba(255,255,255,0.96)_100%)] p-3 shadow-[0_8px_16px_rgba(17,24,39,0.03)] xl:min-h-[4.9rem]">
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-500">Nivel</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {LEVEL_OPTIONS.map((option) => {
                  const selected = selectedLevels.includes(option.value);
                  return <button key={option.value} type="button" onClick={() => setSelectedLevels((current) => toggleItem(current, option.value))} className={`inline-flex items-center rounded-full border px-3 py-1.5 text-[12px] font-medium transition md:px-3.5 md:py-1.5 md:text-[12px] ${selected ? "border-slate-950 bg-slate-950 text-white shadow-[0_6px_14px_rgba(17,24,39,0.1)]" : "border-slate-300/70 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"}`}>{option.label}</button>;
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
              <p className="ui-label">Resultados</p>
              <h3 className="mt-1 text-lg font-semibold text-slate-950">Herramientas disponibles</h3>
            </div>
            <span className="ui-chip inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium">{selectedAreas.length > 0 ? `${selectedAreas.length} áreas` : "Todas las áreas"}</span>
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
