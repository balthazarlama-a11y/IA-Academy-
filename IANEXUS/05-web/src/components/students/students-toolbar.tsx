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

function mapTool(row: RawToolRow): Tool {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    tagline: null,
    editorial_summary: null,
    url: row.url,
    cover_image_url: row.cover_image_url,
    screenshot_url: null,
    demo_video_url: null,
    company_name: null,
    plan: row.plan,
    level: "all",
    ia_type: row.ia_type,
    verified: false,
    edu_verified: row.edu_verified,
    featured: row.featured,
    sort_order: row.sort_order,
    platform_tags: [],
    language_codes: [],
    spanish_available: false,
    feature_bullets: [],
    faq_items: [],
    areas: [],
    primaryArea: null,
    useCases: [],
    created_at: row.created_at,
    guide_slug: null,
  };
}

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

function planPriority(plan: Tool["plan"]) {
  if (plan === "free") return 3;
  if (plan === "edu_free") return 2;
  if (plan === "freemium") return 1;
  return 0;
}

function scoreTool(tool: Tool, filters: StudentsFilters) {
  let score = 0;
  const search = normalizeText(filters.search);
  const name = normalizeText(tool.name);
  const slug = normalizeText(tool.slug);
  const description = normalizeText(tool.description);
  const iaType = normalizeText(tool.ia_type);
  const targetIaType = normalizeText(filters.iaType);

  if (filters.scope === "student_pack") {
    if (tool.plan === "edu_free") score += 50;
    if (tool.edu_verified) score += 30;
  } else {
    if (tool.plan === "free") score += 40;
    if (tool.plan === "edu_free") score += 28;
  }

  if (filters.includeFreemium) {
    if (tool.plan === "freemium") score += 18;
  } else if (tool.plan === "freemium") {
    score -= 12;
  }

  if (targetIaType) {
    if (iaType === targetIaType) score += 24;
    else if (iaType.includes(targetIaType)) score += 10;
  }

  if (tool.featured) score += 8;
  if (tool.edu_verified) score += 12;

  if (search) {
    if (name === search) score += 60;
    else if (name.startsWith(search)) score += 40;
    else if (name.includes(search)) score += 24;

    if (slug.includes(search)) score += 16;
    if (iaType.includes(search)) score += 18;
    if (description.includes(search)) score += 8;
  }

  score += planPriority(tool.plan);
  score += Math.max(0, 20 - Math.min(tool.sort_order, 20));

  return score;
}

function rankTools(tools: Tool[], filters: StudentsFilters) {
  return [...tools].sort((a, b) => {
    const scoreA = scoreTool(a, filters);
    const scoreB = scoreTool(b, filters);

    if (scoreA !== scoreB) return scoreB - scoreA;
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    if (a.edu_verified !== b.edu_verified) return a.edu_verified ? -1 : 1;
    if (a.sort_order !== b.sort_order) return a.sort_order - b.sort_order;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
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
          append
            ? rankTools(mergeUniqueById(previous, cached.value.tools), filters)
            : cached.value.tools,
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
              error: "No se pudo cargar el catálogo. Intenta nuevamente.",
            };
          }

          const rawRows = (data ?? []) as unknown as RawToolRow[];
          const mappedRows = rankTools(rawRows.map(mapTool), filters);
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

      setTools((previous) =>
        append ? rankTools(mergeUniqueById(previous, result.tools), filters) : result.tools,
      );
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
  const activeFilterLabels = [
    searchInput.trim() ? `Búsqueda: ${searchInput.trim()}` : null,
    scopeValue === "student_pack" ? "Beneficio estudiantil" : null,
    includeFreemiumValue ? "Freemium incluido" : null,
    iaTypeValue ? `Tipo: ${iaTypeValue}` : null,
  ].filter(Boolean) as string[];

  return (
    <>
      <section className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_12px_36px_rgba(15,23,42,0.05)]">
        <div className="border-b border-slate-200/80 px-5 py-4 md:px-6 lg:px-7">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                Filtro rápido
              </p>
              <h2 className="mt-1 text-lg font-semibold text-slate-900">
                Encuentra acceso útil sin leer de más
              </h2>
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-600">
                Primero acceso, luego tipo de IA. El filtro prioriza herramientas que puedes usar
                hoy o activar con correo institucional.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-600">
              <span className="font-semibold text-slate-900">{tools.length}</span>
              {hasMore ? "+" : ""} resultados visibles
            </div>
          </div>
        </div>

        <div className="px-5 py-5 md:px-6 lg:px-7">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.95fr)]">
            <div className="space-y-4">
              <label
                htmlFor="q"
                className="block text-xs uppercase tracking-[0.12em] text-slate-600"
              >
                Buscador
              </label>
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3">
                <input
                  id="q"
                  value={searchInput}
                  onChange={(event) => handleSearchChange(event.target.value)}
                  placeholder="Ej.: ChatGPT, Notion, GitHub Copilot..."
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-400"
                />
                <p className="mt-2 text-xs leading-relaxed text-slate-500">
                  Busca por nombre, descripción o tipo de IA.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="mb-2 block text-xs uppercase tracking-[0.12em] text-slate-600">
                  Acceso
                </p>
                <div className="grid gap-2 sm:grid-cols-3">
                  <button
                    type="button"
                    onClick={() => handleScopeChange("all_free")}
                    aria-pressed={scopeValue === "all_free"}
                    className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                      scopeValue === "all_free"
                        ? "border-cyan-300 bg-cyan-400/12 text-cyan-800 shadow-[0_0_0_1px_rgba(34,211,238,0.1)]"
                        : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    <span className="block font-semibold text-slate-900">Gratis total</span>
                    <span className="mt-1 block text-xs leading-relaxed text-slate-500">
                      Sin pago ni tarjeta para empezar.
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleScopeChange("student_pack")}
                    aria-pressed={scopeValue === "student_pack"}
                    className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                      scopeValue === "student_pack"
                        ? "border-emerald-300 bg-emerald-400/12 text-emerald-800 shadow-[0_0_0_1px_rgba(52,211,153,0.1)]"
                        : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    <span className="block font-semibold text-slate-900">Beneficio</span>
                    <span className="mt-1 block text-xs leading-relaxed text-slate-500">
                      Correo institucional o verificación académica.
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleFreemiumChange(!includeFreemiumValue)}
                    aria-pressed={includeFreemiumValue}
                    className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                      includeFreemiumValue
                        ? "border-violet-300 bg-violet-400/12 text-violet-800 shadow-[0_0_0_1px_rgba(196,181,253,0.12)]"
                        : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    <span className="block font-semibold text-slate-900">Freemium</span>
                    <span className="mt-1 block text-xs leading-relaxed text-slate-500">
                      Empiezas gratis y luego decides.
                    </span>
                  </button>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
                <label htmlFor="ia_type" className="block">
                  <span className="mb-2 block text-xs uppercase tracking-[0.12em] text-slate-600">
                    Tipo de IA
                  </span>
                  <select
                    id="ia_type"
                    value={iaTypeValue}
                    onChange={(event) => handleIaTypeChange(event.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                  >
                    <option value="">Todos</option>
                    {iaTypeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>

                <button
                  type="button"
                  onClick={handleClear}
                  className="inline-flex h-11 items-center justify-center rounded-full border border-slate-300 bg-slate-50 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  Limpiar
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 border-t border-slate-200 pt-4 md:flex-row md:items-center md:justify-between">
            {activeFilterLabels.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {activeFilterLabels.map((label) => (
                  <span
                    key={label}
                    className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700"
                  >
                    {label}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                Empieza por acceso y deja el resto como ajuste fino.
              </p>
            )}

            <p className="text-sm text-slate-600">
              Mostrando <span className="font-semibold text-slate-900">{tools.length}</span>
              {hasMore ? "+" : ""} herramientas para estudiantes.
            </p>
          </div>
        </div>
      </section>

      {errorMessage ? (
        <div className="mt-6 rounded-2xl border border-red-300/35 bg-red-400/10 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      {isLoading && tools.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white px-6 py-9 text-center text-slate-700">
          Cargando herramientas...
        </div>
      ) : tools.length > 0 ? (
        <div
          className={`mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 transition-opacity duration-150 ${isLoading ? "pointer-events-none opacity-50" : "opacity-100"}`}
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
