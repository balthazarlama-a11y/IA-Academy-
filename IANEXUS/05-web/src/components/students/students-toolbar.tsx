"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Tool, ToolPlan } from "@/lib/types/tool";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import StudentToolCard from "@/components/students/student-tool-card";
import StudentsEmptyState from "@/components/students/students-empty-state";

type StudentsToolbarProps = {
  initialTools: Tool[];
  initialHasMore: boolean;
  initialNextOffset: number | null;
};

type StudentsFilters = {
  search: string;
  scope: "all_free" | "student_pack";
  includeFreemium: boolean;
  iaType: string;
};

type RawToolRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  url: string;
  cover_image_url: string | null;
  plan: ToolPlan;
  ia_type: string | null;
  edu_verified: boolean;
  featured: boolean;
  sort_order: number;
  created_at: string;
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
const SEARCH_DEBOUNCE_MS = 400;
const CACHE_TTL_MS = 90_000;
const TOOL_SELECT =
  "id, name, slug, description, url, cover_image_url, plan, ia_type, edu_verified, featured, sort_order, created_at";

const DEFAULT_CATEGORY = {
  id: "",
  name: "General",
  slug: "general",
  description: null,
  color_accent: null,
  icon_name: null,
  sort_order: 0,
} as const;

function mapTool(row: RawToolRow): Tool {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    url: row.url,
    cover_image_url: row.cover_image_url,
    plan: row.plan,
    level: "all",
    ia_type: row.ia_type,
    verified: false,
    edu_verified: row.edu_verified,
    featured: row.featured,
    sort_order: row.sort_order,
    created_at: row.created_at,
    category: DEFAULT_CATEGORY,
    guide_slug: null,
  };
}

function extractIaTypes(tools: Tool[]) {
  return Array.from(
    new Set(tools.map((tool) => (tool.ia_type ?? "").trim()).filter(Boolean)),
  ).sort((a, b) => a.localeCompare(b));
}

function clampSearch(value: string) {
  return value.trim().replaceAll(",", " ");
}

function buildKey(filters: StudentsFilters, offset: number) {
  return JSON.stringify({
    search: clampSearch(filters.search).toLowerCase(),
    scope: filters.scope,
    includeFreemium: filters.includeFreemium,
    iaType: filters.iaType,
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

export default function StudentsToolbar({
  initialTools,
  initialHasMore,
  initialNextOffset,
}: StudentsToolbarProps) {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);

  const [searchInput, setSearchInput] = useState("");
  const [scopeValue, setScopeValue] = useState<"all_free" | "student_pack">("all_free");
  const [includeFreemiumValue, setIncludeFreemiumValue] = useState(false);
  const [iaTypeValue, setIaTypeValue] = useState("");

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
    const initialKey = buildKey(
      {
        search: "",
        scope: "all_free",
        includeFreemium: false,
        iaType: "",
      },
      0,
    );

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
    async (offset: number, append: boolean, filters: StudentsFilters) => {
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
          const allowedPlans = filters.includeFreemium
            ? ["free", "edu_free", "freemium"]
            : ["free", "edu_free"];

          let query = supabase
            .from("tools")
            .select(TOOL_SELECT)
            .eq("status", "published")
            .in("plan", allowedPlans)
            .order("featured", { ascending: false })
            .order("sort_order", { ascending: true })
            .order("created_at", { ascending: false });

          if (filters.iaType) {
            query = query.eq("ia_type", filters.iaType);
          }

          if (filters.scope === "student_pack") {
            query = query.or("plan.eq.edu_free,edu_verified.eq.true");
          }

          const safeSearch = clampSearch(filters.search);
          if (safeSearch.length > 0) {
            query = query.or(
              `name.ilike.%${safeSearch}%,ia_type.ilike.%${safeSearch}%,description.ilike.%${safeSearch}%`,
            );
          }

          const { data, error } = await query.range(offset, offset + PAGE_SIZE - 1);

          if (error) {
            return {
              tools: [],
              hasMore: false,
              nextOffset: null,
              error: "No se pudo cargar el catalogo. Intenta nuevamente.",
            };
          }

          const rawRows = ((data ?? []) as unknown as RawToolRow[]);
          const mappedRows = rawRows.map(mapTool);

          const more = rawRows.length === PAGE_SIZE;

          return {
            tools: mappedRows,
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

  function buildFilters(overrides: Partial<StudentsFilters> = {}): StudentsFilters {
    return {
      search: searchInput.trim(),
      scope: scopeValue,
      includeFreemium: includeFreemiumValue,
      iaType: iaTypeValue,
      ...overrides,
    };
  }

  function handleSearchChange(value: string) {
    setSearchInput(value);
    clearSearchTimer();

    searchTimerRef.current = setTimeout(() => {
      const nextFilters = buildFilters({ search: value.trim() });
      void fetchPage(0, false, nextFilters);
    }, SEARCH_DEBOUNCE_MS);
  }

  function handleScopeChange(nextScope: "all_free" | "student_pack") {
    if (nextScope === scopeValue) return;
    clearSearchTimer();
    setScopeValue(nextScope);
    const nextFilters = buildFilters({ scope: nextScope });
    void fetchPage(0, false, nextFilters);
  }

  function handleFreemiumChange(nextFreemium: boolean) {
    if (nextFreemium === includeFreemiumValue) return;
    clearSearchTimer();
    setIncludeFreemiumValue(nextFreemium);
    const nextFilters = buildFilters({ includeFreemium: nextFreemium });
    void fetchPage(0, false, nextFilters);
  }

  function handleIaTypeChange(nextIaType: string) {
    if (nextIaType === iaTypeValue) return;
    clearSearchTimer();
    setIaTypeValue(nextIaType);
    const nextFilters = buildFilters({ iaType: nextIaType });
    void fetchPage(0, false, nextFilters);
  }

  function handleLoadMore() {
    if (!hasMore || nextOffset === null || isLoadingMore) {
      return;
    }

    const nextFilters = buildFilters();
    void fetchPage(nextOffset, true, nextFilters);
  }

  function handleClear() {
    clearSearchTimer();
    setSearchInput("");
    setScopeValue("all_free");
    setIncludeFreemiumValue(false);
    setIaTypeValue("");

    void fetchPage(0, false, {
      search: "",
      scope: "all_free",
      includeFreemium: false,
      iaType: "",
    });
  }

  const iaTypeOptions = useMemo(() => extractIaTypes(tools), [tools]);
  const hasActiveFilters =
    searchInput.trim().length > 0 ||
    scopeValue === "student_pack" ||
    includeFreemiumValue ||
    iaTypeValue.length > 0;

  return (
    <>
      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 md:p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
          <div className="md:col-span-5">
            <label
              htmlFor="q"
              className="mb-2 block text-xs uppercase tracking-[0.12em] text-slate-600"
            >
              Buscador
            </label>
            <input
              id="q"
              value={searchInput}
              onChange={(event) => handleSearchChange(event.target.value)}
              placeholder="Ej: chatgpt, notion, github copilot..."
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-300/60"
            />
          </div>

          <div className="md:col-span-4">
            <p className="mb-2 block text-xs uppercase tracking-[0.12em] text-slate-600">
              Filtros
            </p>
            <div className="flex flex-wrap gap-2">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs text-slate-700">
                <input
                  type="radio"
                  name="scope"
                  value="all_free"
                  checked={scopeValue === "all_free"}
                  onChange={() => handleScopeChange("all_free")}
                />
                Gratis total
              </label>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs text-slate-700">
                <input
                  type="radio"
                  name="scope"
                  value="student_pack"
                  checked={scopeValue === "student_pack"}
                  onChange={() => handleScopeChange("student_pack")}
                />
                Pack estudiante
              </label>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-400/10 px-3 py-1.5 text-xs text-emerald-700">
                <input
                  type="checkbox"
                  checked={includeFreemiumValue}
                  onChange={(event) => handleFreemiumChange(event.target.checked)}
                />
                Incluir freemium
              </label>
            </div>
          </div>

          <div className="md:col-span-3">
            <label
              htmlFor="ia_type"
              className="mb-2 block text-xs uppercase tracking-[0.12em] text-slate-600"
            >
              Tipo de IA
            </label>
            <select
              id="ia_type"
              value={iaTypeValue}
              onChange={(event) => handleIaTypeChange(event.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-300/60"
            >
              <option value="">Todos</option>
              {iaTypeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-12 flex flex-col gap-3 border-t border-slate-200 pt-4 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-slate-600">
              Mostrando <span className="font-semibold text-slate-900">{tools.length}</span>
              {hasMore ? "+" : ""} oportunidades para estudiantes.
            </p>
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex w-fit items-center rounded-full border border-slate-300 bg-slate-50 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
            >
              Limpiar
            </button>
          </div>
        </div>
      </section>

      {errorMessage ? (
        <div className="mt-6 rounded-2xl border border-red-300/35 bg-red-400/10 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      {isLoading && tools.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-slate-200 bg-white px-6 py-10 text-center text-slate-700">
          Cargando herramientas...
        </div>
      ) : tools.length > 0 ? (
        <div
          className={`mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 transition-opacity duration-150 ${isLoading ? "opacity-50 pointer-events-none" : "opacity-100"}`}
        >
          {tools.map((tool) => (
            <StudentToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="mt-8">
          <StudentsEmptyState hasActiveFilters={hasActiveFilters} resetHref="/estudiantes" />
        </div>
      )}

      {hasMore && !isLoading ? (
        <div className="mt-7 flex justify-center">
          <button
            type="button"
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="inline-flex items-center rounded-full border border-slate-300 bg-slate-50 px-5 py-2.5 text-sm font-medium text-slate-800 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoadingMore ? "Cargando..." : "Cargar 50 más"}
          </button>
        </div>
      ) : null}
    </>
  );
}

