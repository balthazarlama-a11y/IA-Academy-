"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { ToolCategory, ToolLevel, ToolPlan } from "@/lib/types/tool";
import type { AreaFilters as RepoAreaFilters } from "@/lib/repositories/areas-repo";
import type { Tool } from "@/lib/types/tool";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import AreaToolsGrid from "./area-tools-grid";
import AreasEmptyState from "./areas-empty-state";

const AREA_OPTIONS = [
  { slug: "programacion", label: "Programacion", accent: "#3b82f6", hint: "Codigo, debugging y producto" },
  { slug: "salud", label: "Salud", accent: "#10b981", hint: "Estudio, resumen y apoyo clinico" },
  { slug: "investigacion", label: "Investigacion", accent: "#8b5cf6", hint: "Lectura, evidencia y sintesis" },
  { slug: "diseno", label: "Diseno", accent: "#ec4899", hint: "Creatividad visual y prototipos" },
  { slug: "escritura", label: "Escritura", accent: "#f97316", hint: "Texto, claridad y redaccion" },
] as const;

const AREA_SLUGS = new Set<string>(AREA_OPTIONS.map((option) => option.slug));
type AreaSlug = (typeof AREA_OPTIONS)[number]["slug"];

const PLAN_OPTIONS: Array<{ value: ToolPlan; label: string }> = [
  { value: "free", label: "Gratis" },
  { value: "edu_free", label: ".edu Gratis" },
  { value: "freemium", label: "Freemium" },
  { value: "paid", label: "Pago" },
];

const LEVEL_OPTIONS: Array<{ value: ToolLevel; label: string }> = [
  { value: "beginner", label: "Principiante" },
  { value: "intermediate", label: "Intermedio" },
  { value: "advanced", label: "Avanzado" },
  { value: "all", label: "Universal" },
];

type LocalFilters = {
  search: string;
  areaSlugs: AreaSlug[];
  plans: ToolPlan[];
  levels: ToolLevel[];
};

type RawCategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color_accent: string | null;
  icon_name: string | null;
  sort_order: number;
};

type RawToolRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  url: string;
  plan: ToolPlan;
  level: ToolLevel;
  ia_type: string | null;
  verified: boolean;
  edu_verified: boolean;
  featured: boolean;
  category_id: string;
  tool_categories: RawCategoryRow | null;
};

type CategoryMapRow = {
  id: string;
  slug: string;
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

export type AreasToolbarProps = {
  initialTools: Tool[];
  initialHasMore: boolean;
  initialNextOffset: number | null;
  initialFilters: RepoAreaFilters;
};

const PAGE_SIZE = 50;
const SEARCH_DEBOUNCE_MS = 250;
const CACHE_TTL_MS = 90_000;

const TOOL_SELECT = [
  "id, name, slug, description, url, plan, level, ia_type, verified, edu_verified, featured, category_id",
  "tool_categories(id, name, slug, description, color_accent, icon_name, sort_order)",
].join(", ");

function mapCategory(row: RawCategoryRow | null): ToolCategory {
  if (!row) {
    return {
      id: "",
      name: "General",
      slug: "general",
      description: null,
      color_accent: null,
      icon_name: null,
      sort_order: 0,
    };
  }

  return row;
}

function mapTool(row: RawToolRow): Tool {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    url: row.url,
    cover_image_url: null,
    plan: row.plan,
    level: row.level,
    ia_type: row.ia_type,
    verified: row.verified,
    edu_verified: row.edu_verified,
    featured: row.featured,
    sort_order: 0,
    created_at: "",
    category: mapCategory(row.tool_categories),
    guide_slug: null,
  };
}

function sanitizeSearch(value: string) {
  return value.trim().replaceAll(",", " ");
}

function normalizeArray(values: string[]): string[] {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function normalizeAreaSlugs(values: string[] | undefined): AreaSlug[] {
  return normalizeArray(values ?? []).filter((value) => AREA_SLUGS.has(value)) as AreaSlug[];
}

function normalizePlans(values: string[] | undefined): ToolPlan[] {
  const valid = new Set<ToolPlan>(PLAN_OPTIONS.map((option) => option.value));
  return normalizeArray(values ?? []).filter((value) => valid.has(value as ToolPlan)) as ToolPlan[];
}

function normalizeLevels(values: string[] | undefined): ToolLevel[] {
  const valid = new Set<ToolLevel>(LEVEL_OPTIONS.map((option) => option.value));
  return normalizeArray(values ?? []).filter((value) => valid.has(value as ToolLevel)) as ToolLevel[];
}

function mergeUniqueById(previous: Tool[], incoming: Tool[]): Tool[] {
  const seen = new Set(previous.map((tool) => tool.id));
  const merged = [...previous];

  for (const tool of incoming) {
    if (!seen.has(tool.id)) {
      seen.add(tool.id);
      merged.push(tool);
    }
  }

  return merged;
}

function toggleItem<T extends string>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

function buildKey(filters: LocalFilters, offset: number): string {
  return JSON.stringify({
    search: sanitizeSearch(filters.search).toLowerCase(),
    areaSlugs: [...filters.areaSlugs].sort(),
    plans: [...filters.plans].sort(),
    levels: [...filters.levels].sort(),
    offset,
    limit: PAGE_SIZE,
  });
}

function hasActiveFilters(filters: LocalFilters): boolean {
  return (
    filters.search.trim().length > 0 ||
    filters.areaSlugs.length > 0 ||
    filters.plans.length > 0 ||
    filters.levels.length > 0
  );
}

export default function AreasToolbar({
  initialTools,
  initialHasMore,
  initialNextOffset,
  initialFilters,
}: AreasToolbarProps) {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const router = useRouter();
  const pathname = usePathname();

  const [searchText, setSearchText] = useState(initialFilters.search ?? "");
  const [selectedAreas, setSelectedAreas] = useState<AreaSlug[]>(
    normalizeAreaSlugs(initialFilters.categorySlugs),
  );
  const [selectedPlans, setSelectedPlans] = useState<ToolPlan[]>(
    normalizePlans(initialFilters.plans),
  );
  const [selectedLevels, setSelectedLevels] = useState<ToolLevel[]>(
    normalizeLevels(initialFilters.levels),
  );

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
  const categoryMapRef = useRef<Map<string, string> | null>(null);

  const currentFilters = useMemo<LocalFilters>(
    () => ({
      search: searchText.trim(),
      areaSlugs: selectedAreas,
      plans: selectedPlans,
      levels: selectedLevels,
    }),
    [searchText, selectedAreas, selectedPlans, selectedLevels],
  );

  useEffect(() => {
    const initialSnapshot: LocalFilters = {
      search: initialFilters.search ?? "",
      areaSlugs: normalizeAreaSlugs(initialFilters.categorySlugs),
      plans: normalizePlans(initialFilters.plans),
      levels: normalizeLevels(initialFilters.levels),
    };

    cacheRef.current.set(buildKey(initialSnapshot, 0), {
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
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }
    };
  }, []);

  const pushUrl = useCallback(
    (filters: LocalFilters) => {
      const params = new URLSearchParams();

      if (filters.search) params.set("q", filters.search);
      for (const area of filters.areaSlugs) params.append("area", area);
      for (const plan of filters.plans) params.append("plan", plan);
      for (const level of filters.levels) params.append("level", level);

      const queryString = params.toString();
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
    },
    [pathname, router],
  );

  const ensureCategoryMap = useCallback(async (): Promise<Map<string, string>> => {
    if (categoryMapRef.current) {
      return categoryMapRef.current;
    }

    const { data, error } = await supabase
      .from("tool_categories")
      .select("id, slug")
      .in("slug", [...AREA_SLUGS]);

    if (error) {
      return new Map();
    }

    const map = new Map<string, string>();
    for (const category of (data ?? []) as CategoryMapRow[]) {
      map.set(category.slug, category.id);
    }

    categoryMapRef.current = map;
    return map;
  }, [supabase]);

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
      if (cached) {
        cacheRef.current.delete(cacheKey);
      }

      const existing = inFlightRef.current.get(cacheKey);
      const task =
        existing ??
        (async (): Promise<PageResult> => {
          let query = supabase
            .from("tools")
            .select(TOOL_SELECT)
            .eq("status", "published")
            .order("featured", { ascending: false })
            .order("sort_order", { ascending: true })
            .order("created_at", { ascending: false });

          if (filters.areaSlugs.length > 0) {
            const categoryMap = await ensureCategoryMap();
            const categoryIds = filters.areaSlugs
              .map((slug) => categoryMap.get(slug))
              .filter((value): value is string => Boolean(value));

            if (categoryIds.length === 0) {
              return { tools: [], hasMore: false, nextOffset: null, error: null };
            }

            query = query.in("category_id", categoryIds);
          }

          if (filters.plans.length > 0) {
            query = query.in("plan", filters.plans);
          }

          if (filters.levels.length > 0) {
            query = query.in("level", filters.levels);
          }

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

      if (!existing) {
        inFlightRef.current.set(cacheKey, task);
      }

      const result = await task;

      if (!existing) {
        inFlightRef.current.delete(cacheKey);
      }

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
    [ensureCategoryMap, supabase],
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
        areaSlugs: selectedAreas,
        plans: selectedPlans,
        levels: selectedLevels,
      });
    }, SEARCH_DEBOUNCE_MS);
  };

  const onToggleArea = (slug: AreaSlug) => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    const nextAreas = toggleItem(selectedAreas, slug);
    setSelectedAreas(nextAreas);
    applyFilters({
      search: searchText.trim(),
      areaSlugs: nextAreas,
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
      areaSlugs: selectedAreas,
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
      areaSlugs: selectedAreas,
      plans: selectedPlans,
      levels: nextLevels,
    });
  };

  const onReset = () => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    const empty: LocalFilters = { search: "", areaSlugs: [], plans: [], levels: [] };
    setSearchText("");
    setSelectedAreas([]);
    setSelectedPlans([]);
    setSelectedLevels([]);
    applyFilters(empty);
  };

  const onLoadMore = () => {
    if (!hasMore || nextOffset === null || isLoadingMore) return;
    void fetchPage(nextOffset, true, {
      search: searchText.trim(),
      areaSlugs: selectedAreas,
      plans: selectedPlans,
      levels: selectedLevels,
    });
  };

  const hasFilters = hasActiveFilters(currentFilters);

  return (
    <div className="w-full flex flex-col gap-5">
      <section className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_14px_38px_rgba(15,23,42,0.05)]">
        <div className="border-b border-slate-200 px-5 py-4 md:px-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                Curadoria por carrera
              </p>
              <h2 className="mt-1 text-lg font-semibold text-slate-900">
                Combina carrera, plan y nivel
              </h2>
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-600">
                Selecciona una o varias carreras para afinar el catalogo. Puedes cruzar
                profesiones, acceso y complejidad sin perder contexto editorial.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-600">
              <span className="font-semibold text-slate-900">{tools.length}</span>
              {hasMore ? "+" : ""} resultados visibles
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 px-5 py-5 md:px-6">
          <div>
            <label
              htmlFor="area-search"
              className="mb-2 block text-xs uppercase tracking-[0.12em] text-slate-600"
            >
              Buscar por nombre o tema
            </label>
            <input
              id="area-search"
              type="text"
              placeholder="Buscar herramienta, carrera o tema..."
              value={searchText}
              onChange={(event) => onSearchChange(event.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-slate-400"
            />
          </div>

          <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Carreras</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  Selecciona una o varias profesiones
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {AREA_OPTIONS.map((area) => {
                const checked = selectedAreas.includes(area.slug);
                return (
                  <label
                    key={area.slug}
                    className="flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-3 text-sm transition-colors"
                    style={{
                      borderColor: checked ? `${area.accent}66` : "rgba(148,163,184,0.32)",
                      background: checked ? `${area.accent}18` : "rgba(255,255,255,0.95)",
                      color: checked ? area.accent : "rgba(51,65,85,0.88)",
                    }}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => onToggleArea(area.slug)}
                        className="mt-1 h-4 w-4 accent-blue-600"
                      />
                      <span>
                        <span className="block font-medium">{area.label}</span>
                        <span className="block text-xs leading-relaxed text-slate-500">
                          {area.hint}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-[20px] border border-slate-200 bg-white p-4">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
                Plan
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {PLAN_OPTIONS.map((plan) => {
                  const checked = selectedPlans.includes(plan.value);
                  return (
                    <label
                      key={plan.value}
                      className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 transition hover:border-slate-300"
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

            <div className="rounded-[20px] border border-slate-200 bg-white p-4">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
                Nivel
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {LEVEL_OPTIONS.map((level) => {
                  const checked = selectedLevels.includes(level.value);
                  return (
                    <label
                      key={level.value}
                      className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 transition hover:border-slate-300"
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
              Mostrando <span className="text-slate-600">{tools.length}{hasMore ? "+" : ""}</span>{" "}
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
        <div className="rounded-3xl border border-slate-200 bg-white px-6 py-10 text-center text-slate-700">
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

