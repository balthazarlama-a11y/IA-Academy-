"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BadgeCheck,
  GraduationCap,
  Layers3,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import type { Tool, ToolLevel, ToolPlan } from "@/lib/types/tool";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import AreaToolsGrid from "@/components/areas/area-tools-grid";
import AreasEmptyState from "@/components/areas/areas-empty-state";
import {
  CAREER_TOOL_SELECT,
  CACHE_TTL_MS,
  LEVEL_OPTIONS,
  PAGE_SIZE,
  PLAN_OPTIONS,
  SEARCH_DEBOUNCE_MS,
  buildKey,
  hasActiveFilters,
  mergeUniqueById,
  sanitizeSearch,
  toggleItem,
  type CareerOption,
  type LocalFilters,
  type RawToolRow,
  getCareerPaths,
  mapTool,
} from "@/lib/areas/utils";

type AreasToolbarProps = {
  initialTools: Tool[];
  initialHasMore: boolean;
  initialNextOffset: number | null;
  initialFilters: LocalFilters;
  careerOptions: CareerOption[];
};

type PageResult = {
  tools: Tool[];
  hasMore: boolean;
  nextOffset: number | null;
  error: string | null;
};

type CacheEntry = {
  expiresAt: number;
  value: PageResult;
};

const PRIMARY_CAREER_COUNT = 6;
const PLAN_LABELS = new Map(PLAN_OPTIONS.map((option) => [option.value, option.label]));
const LEVEL_LABELS = new Map(LEVEL_OPTIONS.map((option) => [option.value, option.label]));

function clampText(value: string) {
  return sanitizeSearch(value).trim();
}

function signature(filters: LocalFilters, offset: number) {
  return buildKey(filters, offset);
}

export default function AreasToolbar({
  initialTools,
  initialHasMore,
  initialNextOffset,
  initialFilters,
  careerOptions,
}: AreasToolbarProps) {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);

  const [searchInput, setSearchInput] = useState(initialFilters.search);
  const [careerSlugs, setCareerSlugs] = useState<string[]>(initialFilters.careerSlugs);
  const [plans, setPlans] = useState<ToolPlan[]>(initialFilters.plans);
  const [levels, setLevels] = useState<ToolLevel[]>(initialFilters.levels);
  const [tools, setTools] = useState<Tool[]>(initialTools);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [nextOffset, setNextOffset] = useState<number | null>(
    initialNextOffset ?? (initialHasMore ? initialTools.length : null),
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const requestIdRef = useRef(0);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cacheRef = useRef<Map<string, CacheEntry>>(new Map());
  const inFlightRef = useRef<Map<string, Promise<PageResult>>>(new Map());

  const featuredCareers = useMemo(() => careerOptions.slice(0, PRIMARY_CAREER_COUNT), [careerOptions]);
  const secondaryCareers = useMemo(() => careerOptions.slice(PRIMARY_CAREER_COUNT), [careerOptions]);
  const selectedCareerMap = useMemo(
    () => new Map(careerOptions.map((career) => [career.slug, career])),
    [careerOptions],
  );
  const hasSelectedCareerInSecondary = secondaryCareers.some((career) => careerSlugs.includes(career.slug));

  useEffect(() => {
    cacheRef.current.set(signature(initialFilters, 0), {
      expiresAt: Date.now() + CACHE_TTL_MS,
      value: {
        tools: initialTools,
        hasMore: initialHasMore,
        nextOffset: initialNextOffset ?? (initialHasMore ? initialTools.length : null),
        error: null,
      },
    });
  }, [initialFilters, initialHasMore, initialNextOffset, initialTools]);

  useEffect(
    () => () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    },
    [],
  );

  const fetchPage = useCallback(
    async (offset: number, append: boolean, filters: LocalFilters) => {
      const requestId = ++requestIdRef.current;
      const requestKey = signature(filters, offset);

      setIsLoading(!append);
      setIsLoadingMore(append);
      setErrorMessage(null);

      const cached = cacheRef.current.get(requestKey);
      if (cached && cached.expiresAt > Date.now()) {
        if (requestId !== requestIdRef.current) return;
        setTools((previous) => (append ? mergeUniqueById(previous, cached.value.tools) : cached.value.tools));
        setHasMore(cached.value.hasMore);
        setNextOffset(cached.value.nextOffset);
        setIsLoading(false);
        setIsLoadingMore(false);
        return;
      }

      if (cached && cached.expiresAt <= Date.now()) cacheRef.current.delete(requestKey);

      const existing = inFlightRef.current.get(requestKey);
      const task =
        existing ??
        (async (): Promise<PageResult> => {
          const careerIdMap = new Map(careerOptions.map((career) => [career.slug, career.id]));
          let toolIds: string[] | null = null;

          if (filters.careerSlugs.length > 0) {
            const selectedCareerIds = filters.careerSlugs
              .map((slug) => careerIdMap.get(slug))
              .filter((value): value is string => Boolean(value));

            if (selectedCareerIds.length === 0) return { tools: [], hasMore: false, nextOffset: null, error: null };

            const { data: relationRows, error: relationError } = await supabase
              .from("tool_careers")
              .select("tool_id")
              .in("career_path_id", selectedCareerIds);

            if (relationError) {
              return {
                tools: [],
                hasMore: false,
                nextOffset: null,
                error: "No se pudo resolver la relacion con las carreras. Intenta nuevamente.",
              };
            }

            toolIds = [...new Set((relationRows ?? []).map((row) => row.tool_id).filter(Boolean))];
            if (toolIds.length === 0) return { tools: [], hasMore: false, nextOffset: null, error: null };
          }

          let query = supabase
            .from("tools")
            .select(CAREER_TOOL_SELECT)
            .eq("status", "published")
            .order("featured", { ascending: false })
            .order("sort_order", { ascending: true })
            .order("created_at", { ascending: false });

          if (toolIds) query = query.in("id", toolIds);
          if (filters.plans.length > 0) query = query.in("plan", filters.plans);
          if (filters.levels.length > 0) query = query.in("level", filters.levels);

          const safeSearch = clampText(filters.search);
          if (safeSearch.length > 0) {
            query = query.or(`name.ilike.%${safeSearch}%,description.ilike.%${safeSearch}%,ia_type.ilike.%${safeSearch}%`);
          }

          const { data, error } = await query.range(offset, offset + PAGE_SIZE - 1);
          if (error) {
            return {
              tools: [],
              hasMore: false,
              nextOffset: null,
              error: "No se pudo cargar el catalogo de areas. Intenta nuevamente.",
            };
          }

          const rawRows = (data ?? []) as unknown as RawToolRow[];
          const mappedRows = rawRows.map((row) => {
            const mapped = mapTool(row);
            const careers = getCareerPaths(row.tool_careers);
            if (filters.careerSlugs.length > 0) {
              const matchedCareer = careers.find((career) => filters.careerSlugs.includes(career.slug));
              if (matchedCareer) return { ...mapped, category: { ...mapped.category, ...matchedCareer } };
            }
            return mapped;
          });

          const more = rawRows.length === PAGE_SIZE;
          return { tools: mappedRows, hasMore: more, nextOffset: more ? offset + PAGE_SIZE : null, error: null };
        })();

      if (!existing) inFlightRef.current.set(requestKey, task);
      const result = await task;
      if (!existing) inFlightRef.current.delete(requestKey);
      if (requestId !== requestIdRef.current) return;

      if (result.error) {
        setErrorMessage(result.error);
        setIsLoading(false);
        setIsLoadingMore(false);
        return;
      }

      cacheRef.current.set(requestKey, { expiresAt: Date.now() + CACHE_TTL_MS, value: result });
      setTools((previous) => (append ? mergeUniqueById(previous, result.tools) : result.tools));
      setHasMore(result.hasMore);
      setNextOffset(result.nextOffset);
      setIsLoading(false);
      setIsLoadingMore(false);
    },
    [careerOptions, supabase],
  );

  function clearTimer() {
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
      searchTimerRef.current = null;
    }
  }

  function buildFilters(overrides: Partial<LocalFilters> = {}): LocalFilters {
    return {
      search: searchInput.trim(),
      careerSlugs,
      plans,
      levels,
      ...overrides,
    };
  }

  function applyFilters(nextFilters: LocalFilters) {
    setSearchInput(nextFilters.search);
    setCareerSlugs(nextFilters.careerSlugs);
    setPlans(nextFilters.plans);
    setLevels(nextFilters.levels);
    void fetchPage(0, false, nextFilters);
  }

  function handleSearchChange(value: string) {
    setSearchInput(value);
    clearTimer();
    searchTimerRef.current = setTimeout(() => {
      void fetchPage(0, false, buildFilters({ search: value.trim() }));
    }, SEARCH_DEBOUNCE_MS);
  }

  function handleCareerToggle(slug: string) {
    clearTimer();
    applyFilters(buildFilters({ careerSlugs: toggleItem(careerSlugs, slug) }));
  }

  function handlePlanToggle(plan: ToolPlan) {
    clearTimer();
    applyFilters(buildFilters({ plans: toggleItem(plans, plan) }));
  }

  function handleLevelToggle(level: ToolLevel) {
    clearTimer();
    applyFilters(buildFilters({ levels: toggleItem(levels, level) }));
  }

  function handleLoadMore() {
    if (!hasMore || nextOffset === null || isLoadingMore) return;
    void fetchPage(nextOffset, true, buildFilters());
  }

  function handleClearAll() {
    clearTimer();
    applyFilters({ search: "", careerSlugs: [], plans: [], levels: [] });
  }

  function removeCareer(slug: string) {
    applyFilters(buildFilters({ careerSlugs: careerSlugs.filter((item) => item !== slug) }));
  }

  function removePlan(plan: ToolPlan) {
    applyFilters(buildFilters({ plans: plans.filter((item) => item !== plan) }));
  }

  function removeLevel(level: ToolLevel) {
    applyFilters(buildFilters({ levels: levels.filter((item) => item !== level) }));
  }

  /* eslint-disable react-hooks/refs */
  const activeChips: Array<{ key: string; label: string; onRemove: () => void }> = [];

  if (searchInput.trim()) {
    activeChips.push({
      key: "search",
      label: `Busqueda: ${searchInput.trim()}`,
      onRemove: () => {
        applyFilters(buildFilters({ search: "" }));
      },
    });
  }

  careerSlugs.forEach((slug) => {
    activeChips.push({
      key: `career-${slug}`,
      label: selectedCareerMap.get(slug)?.name ?? slug,
      onRemove: () => removeCareer(slug),
    });
  });

  plans.forEach((plan) => {
    activeChips.push({
      key: `plan-${plan}`,
      label: PLAN_LABELS.get(plan) ?? plan,
      onRemove: () => removePlan(plan),
    });
  });

  levels.forEach((level) => {
    activeChips.push({
      key: `level-${level}`,
      label: LEVEL_LABELS.get(level) ?? level,
      onRemove: () => removeLevel(level),
    });
  });

  const hasSelections = hasActiveFilters(buildFilters());
  /* eslint-enable react-hooks/refs */
  const selectedCareerCount = careerSlugs.length;
  const selectedPlanCount = plans.length;
  const selectedLevelCount = levels.length;
  const visibleCountLabel = `${tools.length}${hasMore ? "+" : ""}`;
  const secondaryOpen = hasSelectedCareerInSecondary;

  return (
    <section className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/92 shadow-[0_16px_44px_rgba(15,23,42,0.06)] backdrop-blur-sm">
      <div className="border-b border-slate-200/80 bg-[linear-gradient(180deg,rgba(248,243,234,0.78)_0%,rgba(255,255,255,0.94)_100%)] px-5 py-5 md:px-6 md:py-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="max-w-3xl">
              <p className="inline-flex items-center gap-2 rounded-full border border-amber-300/40 bg-amber-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-800">
                <Sparkles className="h-3.5 w-3.5" />
                Descubrimiento profesional
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
                Busca por carrera, acceso y nivel.
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
                Primero la necesidad. Despues el refinamiento. La superficie esta pensada para
                llegar rapido a una ruta util, no para recorrer una taxonomia larga.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs text-slate-600 shadow-[0_8px_20px_rgba(15,23,42,0.04)]">
              <span className="font-semibold text-slate-950">{visibleCountLabel}</span>
              herramientas visibles
            </div>
          </div>

          <label className="group relative block">
            <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Buscar
            </span>
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="area-search"
                value={searchInput}
                onChange={(event) => handleSearchChange(event.target.value)}
                placeholder="Ej: programacion, investigacion, salud, diseno..."
                className="w-full rounded-[1.1rem] border border-slate-300/80 bg-white px-11 py-3.5 text-sm text-slate-950 shadow-[0_8px_24px_rgba(15,23,42,0.04)] outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-200/50"
              />
            </div>
          </label>

          {activeChips.length > 0 ? (
            <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50/80 px-3 py-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700">
                <BadgeCheck className="h-3.5 w-3.5 text-slate-500" />
                Filtros activos
              </span>
              {activeChips.map((chip) => (
                <button key={chip.key} type="button" onClick={chip.onRemove} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-100">
                  <span className="max-w-[16rem] truncate">{chip.label}</span>
                  <span aria-hidden="true" className="text-slate-400">×</span>
                </button>
              ))}
              <button type="button" onClick={handleClearAll} className="ml-auto inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100">
                <X className="h-3.5 w-3.5" />
                Limpiar todo
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <div className="grid gap-6 px-5 py-5 md:px-6 xl:grid-cols-[1.08fr_0.92fr] xl:gap-5">
        <div className="space-y-5">
          <div>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Rutas profesionales</p>
                <h3 className="mt-1 text-lg font-semibold text-slate-950">Selecciona una o varias carreras.</h3>
              </div>
              <button type="button" onClick={() => applyFilters(buildFilters({ careerSlugs: [] }))} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50">
                <X className="h-3.5 w-3.5" />
                Quitar carreras
              </button>
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {featuredCareers.map((career) => {
                const selected = careerSlugs.includes(career.slug);
                const accentColor = career.color_accent ?? "#475569";
                const description = career.description?.trim() || "Descubre herramientas pensadas para esta ruta profesional.";

                return (
                  <button key={career.slug} type="button" onClick={() => handleCareerToggle(career.slug)} className={`group relative flex min-h-[8.25rem] flex-col items-start overflow-hidden rounded-2xl border p-4 text-left transition-all duration-150 ${selected ? "border-slate-950/10 bg-slate-950/3 shadow-[0_16px_32px_rgba(15,23,42,0.08)]" : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_14px_28px_rgba(15,23,42,0.06)]"}`} style={{ boxShadow: selected ? `0 18px 32px ${accentColor}12` : undefined }}>
                    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl border text-sm font-semibold" style={{ color: accentColor, background: `${accentColor}10`, borderColor: `${accentColor}24` }}>{career.name.charAt(0).toUpperCase()}</div>
                    <div className="flex w-full items-start justify-between gap-3">
                      <div className="min-w-0">
                        <span className="block text-base font-semibold text-slate-950">{career.name}</span>
                        <span className="mt-1 block text-xs uppercase tracking-[0.14em] text-slate-400">Ruta profesional</span>
                      </div>
                      {selected ? <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full" style={{ background: `${accentColor}14`, color: accentColor }}><BadgeCheck className="h-4 w-4" /></span> : null}
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">{description}</p>
                    <span className="mt-3 inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium" style={{ color: accentColor, background: `${accentColor}0f`, border: `1px solid ${accentColor}1f` }}>{selected ? "Quitar filtro" : "Explorar ruta"}</span>
                  </button>
                );
              })}
            </div>

            {secondaryCareers.length > 0 ? (
              <details className="mt-4 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)]" open={secondaryOpen}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-950">Mas rutas</p>
                    <p className="mt-1 text-xs text-slate-500">Otras areas para refinar sin perder contexto editorial.</p>
                  </div>
                  <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">{secondaryCareers.length} disponibles</span>
                </summary>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {secondaryCareers.map((career) => {
                    const selected = careerSlugs.includes(career.slug);
                    const accentColor = career.color_accent ?? "#475569";
                    return (
                      <button key={career.slug} type="button" onClick={() => handleCareerToggle(career.slug)} className={`flex items-start gap-3 rounded-xl border px-3 py-3 text-left transition ${selected ? "border-slate-950/10 bg-slate-950/3" : "border-slate-200 bg-slate-50/70 hover:border-slate-300 hover:bg-white"}`}>
                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-semibold" style={{ color: accentColor, background: `${accentColor}10`, border: `1px solid ${accentColor}1f` }}>{career.name.charAt(0).toUpperCase()}</span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-semibold text-slate-950">{career.name}</span>
                          <span className="mt-1 line-clamp-1 block text-xs text-slate-500">{career.description?.trim() || "Ruta adicional para explorar herramientas especializadas."}</span>
                        </span>
                        {selected ? <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full" style={{ background: `${accentColor}14`, color: accentColor }}><BadgeCheck className="h-3.5 w-3.5" /></span> : null}
                      </button>
                    );
                  })}
                </div>
              </details>
            ) : null}
          </div>
        </div>

        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <div className="rounded-xl border border-slate-200 bg-[linear-gradient(180deg,rgba(248,250,252,0.95)_0%,rgba(255,255,255,0.92)_100%)] p-3 shadow-[0_8px_16px_rgba(15,23,42,0.03)]">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="inline-flex items-center gap-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-500"><BadgeCheck className="h-3 w-3 text-emerald-500" />Acceso</p>
                  <h3 className="mt-0.5 text-sm font-semibold text-slate-950">Prioriza el tipo de acceso.</h3>
                </div>
                <span className="text-[11px] text-slate-500 whitespace-nowrap">{selectedPlanCount > 0 ? `${selectedPlanCount} activos` : "Todos"}</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {PLAN_OPTIONS.map((option) => {
                  const selected = plans.includes(option.value);
                  return (
                    <button key={option.value} type="button" onClick={() => handlePlanToggle(option.value)} className={`inline-flex items-center rounded-full border px-2.5 py-1.5 text-xs font-medium transition ${selected ? "border-slate-950 bg-slate-950 text-white shadow-[0_6px_14px_rgba(15,23,42,0.1)]" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"}`}>
                      {option.label}
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-slate-500">Selecciona uno o varios accesos. Si no marcas nada, se muestran todas las opciones.</p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-[linear-gradient(180deg,rgba(248,250,252,0.95)_0%,rgba(255,255,255,0.92)_100%)] p-3 shadow-[0_8px_16px_rgba(15,23,42,0.03)]">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="inline-flex items-center gap-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-500"><Layers3 className="h-3 w-3 text-sky-500" />Nivel</p>
                  <h3 className="mt-0.5 text-sm font-semibold text-slate-950">Ajusta la complejidad.</h3>
                </div>
                <span className="text-[11px] text-slate-500 whitespace-nowrap">{selectedLevelCount > 0 ? `${selectedLevelCount} activos` : "Todos"}</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {LEVEL_OPTIONS.map((option) => {
                  const selected = levels.includes(option.value);
                  return (
                    <button key={option.value} type="button" onClick={() => handleLevelToggle(option.value)} className={`inline-flex items-center rounded-full border px-2.5 py-1.5 text-xs font-medium transition ${selected ? "border-slate-950 bg-slate-950 text-white shadow-[0_6px_14px_rgba(15,23,42,0.1)]" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"}`}>
                      {option.label}
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-slate-500">Util para separar herramientas de entrada rapida de opciones mas especializadas.</p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-[0_8px_16px_rgba(15,23,42,0.03)]">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-500">Estado</p>
                <h3 className="mt-0.5 text-sm font-semibold text-slate-950">Lo que ya estas viendo.</h3>
              </div>
              <button type="button" onClick={handleClearAll} disabled={!hasSelections} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50">
                <X className="h-3 w-3" />
                Limpiar
              </button>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2">
                <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-500">Carreras</p>
                <p className="mt-1 text-base font-semibold text-slate-950">{selectedCareerCount || "Todas"}</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2">
                <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-500">Acceso</p>
                <p className="mt-1 text-base font-semibold text-slate-950">{selectedPlanCount || "Todos"}</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2">
                <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-500">Nivel</p>
                <p className="mt-1 text-base font-semibold text-slate-950">{selectedLevelCount || "Todos"}</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2">
                <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-500">Resultados</p>
                <p className="mt-1 text-base font-semibold text-slate-950">{visibleCountLabel}</p>
              </div>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
              <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1"><BadgeCheck className="h-3 w-3 text-emerald-500" />{selectedCareerCount > 0 ? "Carreras activas" : "Todas las carreras"}</span>
              <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1"><GraduationCap className="h-3 w-3 text-sky-500" />{selectedPlanCount > 0 ? "Refinando acceso" : "Sin filtro de acceso"}</span>
            </div>
          </div>
        </div>
      </div>

      {errorMessage ? <div className="border-t border-red-200 bg-red-50 px-5 py-3 text-sm text-red-700 md:px-6">{errorMessage}</div> : null}

      <div className="px-5 py-5 md:px-6">
        {isLoading && tools.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">Cargando herramientas...</div>
        ) : tools.length > 0 ? (
          <AreaToolsGrid tools={tools} isLoading={isLoading} hasMore={hasMore} isLoadingMore={isLoadingMore} onLoadMore={handleLoadMore} />
        ) : (
          <AreasEmptyState hasFilters={hasSelections} onReset={handleClearAll} />
        )}
      </div>
    </section>
  );
}










