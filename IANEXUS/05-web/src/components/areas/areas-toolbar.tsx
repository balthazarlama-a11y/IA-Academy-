"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Tool, ToolCategory, ToolLevel, ToolPlan } from "@/lib/types/tool";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import AreaToolCard from "./area-tool-card";
import AreasEmptyState from "./areas-empty-state";

const AREAS = [
  { slug: "programacion", label: "Programacion", accent: "#3b82f6" },
  { slug: "salud", label: "Salud", accent: "#10b981" },
  { slug: "investigacion", label: "Investigacion", accent: "#8b5cf6" },
  { slug: "diseno", label: "Diseno", accent: "#ec4899" },
  { slug: "escritura", label: "Escritura", accent: "#f97316" },
] as const;

type AreaSlug = (typeof AREAS)[number]["slug"];

type AreasToolbarProps = {
  initialTools: Tool[];
  initialHasMore: boolean;
  initialNextOffset: number | null;
};

type AreaFilters = {
  search: string;
  activeArea: AreaSlug | null;
  freeOnly: boolean;
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
  tool_categories: RawCategoryRow | null;
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

const PAGE_SIZE = 50;
const SEARCH_DEBOUNCE_MS = 250;
const CACHE_TTL_MS = 90_000;
const TOOL_SELECT = [
  "id, name, slug, description, url, plan, level, ia_type, verified, edu_verified, featured",
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
    logo_url: null,
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

function buildKey(filters: AreaFilters, offset: number) {
  return JSON.stringify({
    search: sanitizeSearch(filters.search).toLowerCase(),
    activeArea: filters.activeArea ?? "",
    freeOnly: filters.freeOnly,
    offset,
    limit: PAGE_SIZE,
  });
}

function mergeUniqueById(previous: Tool[], incoming: Tool[]) {
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

export default function AreasToolbar({
  initialTools,
  initialHasMore,
  initialNextOffset,
}: AreasToolbarProps) {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);

  const [searchText, setSearchText] = useState("");
  const [activeArea, setActiveArea] = useState<AreaSlug | null>(null);
  const [freeOnly, setFreeOnly] = useState(false);

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

  useEffect(() => {
    const initialKey = buildKey({ search: "", activeArea: null, freeOnly: false }, 0);
    cacheRef.current.set(initialKey, {
      expiresAt: Date.now() + CACHE_TTL_MS,
      value: {
        tools: initialTools,
        hasMore: initialHasMore,
        nextOffset: initialNextOffset ?? (initialHasMore ? initialTools.length : null),
        error: null,
      },
    });
  }, [initialHasMore, initialNextOffset, initialTools]);

  useEffect(
    () => () => {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }
    },
    [],
  );

  const fetchPage = useCallback(
    async (offset: number, append: boolean, filters: AreaFilters) => {
      const requestId = ++requestIdRef.current;
      const requestKey = buildKey(filters, offset);

      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }

      setErrorMessage(null);

      const cached = cacheRef.current.get(requestKey);
      if (cached && cached.expiresAt > Date.now()) {
        if (requestId !== requestIdRef.current) return;

        setTools((previous) =>
          append ? mergeUniqueById(previous, cached.value.tools) : cached.value.tools,
        );
        setHasMore(cached.value.hasMore);
        setNextOffset(cached.value.nextOffset);
        setIsLoading(false);
        setIsLoadingMore(false);
        return;
      }

      if (cached && cached.expiresAt <= Date.now()) {
        cacheRef.current.delete(requestKey);
      }

      const existing = inFlightRef.current.get(requestKey);

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

          if (filters.activeArea) {
            query = query.eq("tool_categories.slug", filters.activeArea);
          }

          if (filters.freeOnly) {
            query = query.in("plan", ["free", "edu_free"]);
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
              error: "No se pudo cargar herramientas por area. Intenta de nuevo.",
            };
          }

          const rows = ((data ?? []) as unknown as RawToolRow[]).map(mapTool);
          const more = rows.length === PAGE_SIZE;

          return {
            tools: rows,
            hasMore: more,
            nextOffset: more ? offset + PAGE_SIZE : null,
            error: null,
          };
        })();

      if (!existing) {
        inFlightRef.current.set(requestKey, task);
      }

      const result = await task;

      if (!existing) {
        inFlightRef.current.delete(requestKey);
      }

      if (requestId !== requestIdRef.current) {
        return;
      }

      if (result.error) {
        setErrorMessage(result.error);
        setIsLoading(false);
        setIsLoadingMore(false);
        return;
      }

      cacheRef.current.set(requestKey, {
        expiresAt: Date.now() + CACHE_TTL_MS,
        value: result,
      });

      setTools((previous) => (append ? mergeUniqueById(previous, result.tools) : result.tools));
      setHasMore(result.hasMore);
      setNextOffset(result.nextOffset);
      setIsLoading(false);
      setIsLoadingMore(false);
    },
    [supabase],
  );

  function clearSearchTimer() {
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
      searchTimerRef.current = null;
    }
  }

  function buildFilters(overrides: Partial<AreaFilters> = {}): AreaFilters {
    return {
      search: searchText.trim(),
      activeArea,
      freeOnly,
      ...overrides,
    };
  }

  function handleSearchChange(value: string) {
    setSearchText(value);
    clearSearchTimer();

    searchTimerRef.current = setTimeout(() => {
      const nextFilters = buildFilters({ search: value.trim() });
      void fetchPage(0, false, nextFilters);
    }, SEARCH_DEBOUNCE_MS);
  }

  function handleAreaToggle(area: AreaSlug) {
    clearSearchTimer();
    const nextArea = activeArea === area ? null : area;
    setActiveArea(nextArea);

    const nextFilters = buildFilters({ activeArea: nextArea });
    void fetchPage(0, false, nextFilters);
  }

  function handleFreeToggle() {
    clearSearchTimer();
    const nextFree = !freeOnly;
    setFreeOnly(nextFree);

    const nextFilters = buildFilters({ freeOnly: nextFree });
    void fetchPage(0, false, nextFilters);
  }

  function resetFilters() {
    clearSearchTimer();
    setActiveArea(null);
    setFreeOnly(false);
    setSearchText("");

    void fetchPage(0, false, { search: "", activeArea: null, freeOnly: false });
  }

  function handleLoadMore() {
    if (!hasMore || nextOffset === null || isLoadingMore) {
      return;
    }

    const nextFilters = buildFilters();
    void fetchPage(nextOffset, true, nextFilters);
  }

  const hasFilters = Boolean(activeArea) || freeOnly || searchText.trim().length > 0;

  return (
    <div className="w-full max-w-5xl flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar herramienta..."
            value={searchText}
            onChange={(event) => handleSearchChange(event.target.value)}
            className="w-full rounded-2xl px-4 py-3 text-sm text-white placeholder-white/35 outline-none transition-all focus:ring-1 focus:ring-white/20"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.10)",
              backdropFilter: "blur(16px)",
            }}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {AREAS.map((area) => {
            const isActive = activeArea === area.slug;
            return (
              <button
                key={area.slug}
                type="button"
                onClick={() => handleAreaToggle(area.slug)}
                className="rounded-full px-4 py-1.5 text-sm font-medium transition-all"
                style={
                  isActive
                    ? {
                        background: `${area.accent}25`,
                        border: `1px solid ${area.accent}60`,
                        color: area.accent,
                      }
                    : {
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.10)",
                        color: "rgba(255,255,255,0.55)",
                      }
                }
              >
                {area.label}
              </button>
            );
          })}

          <span className="hidden sm:block h-5 w-px bg-white/15" />

          <button
            type="button"
            onClick={handleFreeToggle}
            className="rounded-full px-4 py-1.5 text-sm font-medium transition-all"
            style={
              freeOnly
                ? {
                    background: "rgba(52,211,153,0.18)",
                    border: "1px solid rgba(52,211,153,0.45)",
                    color: "rgba(52,211,153,0.95)",
                  }
                : {
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.10)",
                    color: "rgba(255,255,255,0.55)",
                  }
            }
          >
            Solo gratis
          </button>

          {hasFilters ? (
            <button
              type="button"
              onClick={resetFilters}
              className="ml-auto text-xs text-white/40 hover:text-white/70 transition-colors"
            >
              Limpiar filtros
            </button>
          ) : null}
        </div>
      </div>

      <p className="text-xs text-white/40">
        Mostrando {tools.length}
        {hasMore ? "+" : ""} herramientas
      </p>

      {errorMessage ? (
        <div className="rounded-2xl border border-red-300/35 bg-red-400/10 px-4 py-3 text-sm text-red-100">
          {errorMessage}
        </div>
      ) : null}

      {isLoading && tools.length === 0 ? (
        <div className="rounded-3xl border border-white/15 bg-white/[0.05] px-6 py-10 text-center text-white/70">
          Cargando herramientas...
        </div>
      ) : tools.length > 0 ? (
        <>
          <div
            className={`grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 transition-opacity duration-150 ${isLoading ? "pointer-events-none opacity-50" : "opacity-100"}`}
          >
            {tools.map((tool) => (
              <AreaToolCard key={tool.id} tool={tool} />
            ))}
          </div>

          {hasMore ? (
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-medium text-white/85 transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoadingMore ? "Cargando..." : "Cargar 50 mas"}
              </button>
            </div>
          ) : null}
        </>
      ) : (
        <AreasEmptyState hasFilters={hasFilters} />
      )}
    </div>
  );
}
