"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { ToolLevel, ToolPlan } from "@/lib/types/tool";
import type { Tool } from "@/lib/types/tool";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import AreaToolsGrid from "./area-tools-grid";
import AreasEmptyState from "./areas-empty-state";
import {
  CAREER_TOOL_SELECT,
  CACHE_TTL_MS,
  LEVEL_OPTIONS,
  PAGE_SIZE,
  PLAN_OPTIONS,
  SEARCH_DEBOUNCE_MS,
  buildCareerIdMap,
  buildKey,
  hasActiveFilters,
  mapTool,
  mergeUniqueById,
  sanitizeSearch,
  toggleItem,
  type CareerOption,
  type LocalFilters,
  type RawToolRow,
} from "./areas-data";

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

export type AreasToolbarProps = {
  initialTools: Tool[];
  initialHasMore: boolean;
  initialNextOffset: number | null;
  initialFilters: LocalFilters;
  careerOptions: CareerOption[];
};

export default function AreasToolbar({
  initialTools,
  initialHasMore,
  initialNextOffset,
  initialFilters,
  careerOptions,
}: AreasToolbarProps) {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const router = useRouter();
  const pathname = usePathname();

  const [searchText, setSearchText] = useState(initialFilters.search ?? "");
  const [selectedCareers, setSelectedCareers] = useState<string[]>(initialFilters.careerSlugs);
  const [selectedPlans, setSelectedPlans] = useState<ToolPlan[]>(initialFilters.plans);
  const [selectedLevels, setSelectedLevels] = useState<ToolLevel[]>(initialFilters.levels);

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
  const careerIdMap = useMemo(() => buildCareerIdMap(careerOptions), [careerOptions]);

  const currentFilters = useMemo<LocalFilters>(
    () => ({
      search: searchText.trim(),
      careerSlugs: selectedCareers,
      plans: selectedPlans,
      levels: selectedLevels,
    }),
    [searchText, selectedCareers, selectedPlans, selectedLevels],
  );

  useEffect(() => {
    cacheRef.current.set(buildKey(initialFilters, 0), {
      expiresAt: Date.now() + CACHE_TTL_MS,
      value: {
        tools: initialTools,
        hasMore: initialHasMore,
        nextOffset: initialNextOffset ?? (initialHasMore ? initialTools.length : null),
        error: null,
      },
    });
  }, [initialFilters, initialHasMore, initialNextOffset, initialTools]);

  useEffect(() => {
    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    };
  }, []);

  const pushUrl = useCallback(
    (filters: LocalFilters) => {
      const params = new URLSearchParams();

      if (filters.search) params.set("q", filters.search);
      for (const career of filters.careerSlugs) params.append("area", career);
      for (const plan of filters.plans) params.append("plan", plan);
      for (const level of filters.levels) params.append("level", level);

      const queryString = params.toString();
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
    },
    [pathname, router],
  );

  const fetchPage = useCallback(
    async (offset: number, append: boolean, filters: LocalFilters) => {
      const requestId = ++requestIdRef.current;
      const cacheKey = buildKey(filters, offset);

      if (append) setIsLoadingMore(true);
      else setIsLoading(true);
      setErrorMessage(null);

      const cached = cacheRef.current.get(cacheKey);
      if (cached && cached.expiresAt > Date.now()) {
        if (requestId !== requestIdRef.current) return;
        setTools((prev) => (append ? mergeUniqueById(prev, cached.value.tools) : cached.value.tools));
        setHasMore(cached.value.hasMore);
        setNextOffset(cached.value.nextOffset);
        setIsLoading(false);
        setIsLoadingMore(false);
        return;
      }
      if (cached) cacheRef.current.delete(cacheKey);

      const existing = inFlightRef.current.get(cacheKey);
      const task =
        existing ??
        (async (): Promise<PageResult> => {
          let toolIds: string[] | null = null;
          if (filters.careerSlugs.length > 0) {
            const selectedCareerIds = filters.careerSlugs
              .map((slug) => careerIdMap.get(slug))
              .filter((value): value is string => Boolean(value));

            if (selectedCareerIds.length === 0) {
              return { tools: [], hasMore: false, nextOffset: null, error: null };
            }

            const { data: relationRows, error: relationError } = await supabase
              .from("tool_careers")
              .select("tool_id")
              .in("career_path_id", selectedCareerIds);

            if (relationError) {
              return {
                tools: [],
                hasMore: false,
                nextOffset: null,
                error: "No se pudo resolver la carrera seleccionada. Intenta de nuevo.",
              };
            }

            toolIds = [...new Set((relationRows ?? []).map((row) => row.tool_id).filter(Boolean))];
            if (toolIds.length === 0) {
              return { tools: [], hasMore: false, nextOffset: null, error: null };
            }
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

          const safeSearch = sanitizeSearch(filters.search);
          if (safeSearch.length > 0) {
            query = query.or(
              `name.ilike.%${safeSearch}%,description.ilike.%${safeSearch}%,ia_type.ilike.%${safeSearch}%`,
            );
          }

          const { data, error } = await query.range(offset, offset + PAGE_SIZE - 1);
          if (error) {
            return {
              tools: [],
              hasMore: false,
              nextOffset: null,
              error: "No se pudo cargar herramientas. Intenta de nuevo.",
            };
          }

          const rows = ((data ?? []) as unknown as RawToolRow[]).map(mapTool);
          const nextHasMore = rows.length === PAGE_SIZE;
          return {
            tools: rows,
            hasMore: nextHasMore,
            nextOffset: nextHasMore ? offset + PAGE_SIZE : null,
            error: null,
          };
        })();

      if (!existing) inFlightRef.current.set(cacheKey, task);

      const result = await task;
      if (!existing) inFlightRef.current.delete(cacheKey);
      if (requestId !== requestIdRef.current) return;

      if (result.error) {
        setErrorMessage(result.error);
        setIsLoading(false);
        setIsLoadingMore(false);
        return;
      }

      cacheRef.current.set(cacheKey, {
        expiresAt: Date.now() + CACHE_TTL_MS,
        value: result,
      });

      setTools((prev) => (append ? mergeUniqueById(prev, result.tools) : result.tools));
      setHasMore(result.hasMore);
      setNextOffset(result.nextOffset);
      setIsLoading(false);
      setIsLoadingMore(false);
    },
    [careerIdMap, supabase],
  );

  const applyFilters = useCallback(
    (filters: LocalFilters) => {
      pushUrl(filters);
      void fetchPage(0, false, filters);
    },
    [fetchPage, pushUrl],
  );

  const onSearchChange = (value: string) => {
    setSearchText(value);
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      applyFilters({
        search: value.trim(),
        careerSlugs: selectedCareers,
        plans: selectedPlans,
        levels: selectedLevels,
      });
    }, SEARCH_DEBOUNCE_MS);
  };

  const onToggleCareer = (slug: string) => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    const nextCareers = toggleItem<string>(selectedCareers, slug);
    setSelectedCareers(nextCareers);
    applyFilters({
      search: searchText.trim(),
      careerSlugs: nextCareers,
      plans: selectedPlans,
      levels: selectedLevels,
    });
  };

  const onTogglePlan = (plan: ToolPlan) => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    const nextPlans = toggleItem(selectedPlans, plan);
    setSelectedPlans(nextPlans);
    applyFilters({
      search: searchText.trim(),
      careerSlugs: selectedCareers,
      plans: nextPlans,
      levels: selectedLevels,
    });
  };

  const onToggleLevel = (level: ToolLevel) => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    const nextLevels = toggleItem(selectedLevels, level);
    setSelectedLevels(nextLevels);
    applyFilters({
      search: searchText.trim(),
      careerSlugs: selectedCareers,
      plans: selectedPlans,
      levels: nextLevels,
    });
  };

  const onReset = () => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    const empty: LocalFilters = { search: "", careerSlugs: [], plans: [], levels: [] };
    setSearchText("");
    setSelectedCareers([]);
    setSelectedPlans([]);
    setSelectedLevels([]);
    applyFilters(empty);
  };

  const onLoadMore = () => {
    if (!hasMore || nextOffset === null || isLoadingMore) return;
    void fetchPage(nextOffset, true, {
      search: searchText.trim(),
      careerSlugs: selectedCareers,
      plans: selectedPlans,
      levels: selectedLevels,
    });
  };

  const hasFilters = hasActiveFilters(currentFilters);

  return (
    <div className="w-full flex flex-col gap-4">
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_32px_rgba(15,23,42,0.05)]">
        <div className="border-b border-slate-200 px-5 py-4 md:px-6">
          <div className="flex flex-col gap-2.5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
                Curadoria por carrera
              </p>
              <h2 className="mt-1 text-lg font-semibold text-slate-950">
                Combina carrera, plan y nivel
              </h2>
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-600">
                Selecciona una o varias carreras para afinar el catalogo. Puedes cruzar
                profesiones, acceso y complejidad sin perder contexto editorial.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-600">
              <span className="font-semibold text-slate-900">{tools.length}</span>
              {hasMore ? "+" : ""} resultados visibles
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 px-5 py-5 md:px-6">
          <div>
            <label
              htmlFor="career-search"
              className="mb-2 block text-[11px] uppercase tracking-[0.12em] text-slate-600"
            >
              Buscar por nombre o tema
            </label>
            <input
              id="career-search"
              type="text"
              placeholder="Buscar herramienta, carrera o tema..."
              value={searchText}
              onChange={(event) => onSearchChange(event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-slate-400"
            />
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">
                  Carreras
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-950">
                  Selecciona una o varias profesiones
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {careerOptions.map((career) => {
                const checked = selectedCareers.includes(career.slug);
                const accent = career.color_accent ?? "#3b82f6";
                return (
                  <label
                    key={career.slug}
                    className="flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-3 text-sm transition-colors"
                    style={{
                      borderColor: checked ? `${accent}66` : "rgba(148,163,184,0.28)",
                      background: checked ? `${accent}14` : "rgba(255,255,255,0.95)",
                      color: checked ? accent : "rgba(51,65,85,0.88)",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => onToggleCareer(career.slug)}
                      className="mt-1 h-4 w-4 accent-blue-600"
                    />
                    <span>
                      <span className="block font-medium">{career.name}</span>
                      <span className="block text-xs leading-relaxed text-slate-500">
                        {career.description ?? "Herramientas curadas para este contexto profesional."}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500">
                Plan
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {PLAN_OPTIONS.map((plan) => {
                  const checked = selectedPlans.includes(plan.value);
                  return (
                    <label
                      key={plan.value}
                      className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 transition hover:border-slate-300"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => onTogglePlan(plan.value)}
                        className="h-4 w-4 accent-blue-600"
                      />
                      <span>{plan.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500">
                Nivel
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {LEVEL_OPTIONS.map((level) => {
                  const checked = selectedLevels.includes(level.value);
                  return (
                    <label
                      key={level.value}
                      className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 transition hover:border-slate-300"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => onToggleLevel(level.value)}
                        className="h-4 w-4 accent-blue-600"
                      />
                      <span>{level.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-2">
            <p className="text-xs text-slate-500">
              Mostrando <span className="text-slate-700">{tools.length}{hasMore ? "+" : ""}</span>{" "}
              herramientas
            </p>
            {hasFilters ? (
              <button
                type="button"
                onClick={onReset}
                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 transition hover:bg-slate-50"
              >
                Limpiar filtros
              </button>
            ) : null}
          </div>
        </div>
      </section>

      {errorMessage ? (
        <div className="rounded-2xl border border-red-300/35 bg-red-400/10 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      {isLoading && tools.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
          Cargando herramientas...
        </div>
      ) : tools.length > 0 ? (
        <AreaToolsGrid
          tools={tools}
          isLoading={isLoading}
          hasMore={hasMore}
          isLoadingMore={isLoadingMore}
          onLoadMore={onLoadMore}
        />
      ) : (
        <AreasEmptyState hasFilters={hasFilters} />
      )}
    </div>
  );
}
