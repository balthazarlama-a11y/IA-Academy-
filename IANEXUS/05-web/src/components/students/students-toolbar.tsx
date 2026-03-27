"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GraduationCap, Layers3, X } from "lucide-react";
import type { Tool, ToolPlan, ToolUseCase } from "@/lib/types/tool";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import StudentToolCard from "@/components/students/student-tool-card";
import StudentsEmptyState from "@/components/students/students-empty-state";

type StudentsToolbarProps = {
  initialTools: Tool[];
  initialHasMore: boolean;
  initialNextOffset: number | null;
  useCases: ToolUseCase[];
};

type StudentsFilters = {
  scope: "all_free" | "student_pack";
  includeFreemium: boolean;
  useCaseSlugs: string[];
};

type RawUseCase = {
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
  cover_image_url: string | null;
  plan: ToolPlan;
  ia_type: string | null;
  edu_verified: boolean;
  featured: boolean;
  sort_order: number;
  created_at: string;
  tool_use_cases:
    | {
        sort_order: number;
        use_cases: RawUseCase | RawUseCase[] | null;
      }[]
    | null;
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
const CACHE_TTL_MS = 90_000;
const TOOL_SELECT =
  "id, name, slug, description, url, cover_image_url, plan, ia_type, edu_verified, featured, sort_order, created_at, tool_use_cases(sort_order, use_cases(id, name, slug, description, color_accent, icon_name, sort_order))";

const USE_CASE_DISPLAY_LABELS: Record<string, string> = {
  resumir: "Resumir",
  "buscar-investigar": "Buscar e investigar",
  "generar-contenido-creativo": "Generar contenido creativo",
  "programar-depurar": "Programar y depurar",
  "estudiar-practicar": "Estudiar y practicar",
  "organizar-automatizar": "Organizar y automatizar",
};

function pickFirst<T>(value: T | T[] | null): T | null {
  if (!value) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

function mapUseCase(row: RawUseCase | null): ToolUseCase | null {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    color_accent: row.color_accent,
    icon_name: row.icon_name,
    sort_order: row.sort_order,
  };
}

function mapTool(row: RawToolRow): Tool {
  const useCases = (row.tool_use_cases ?? [])
    .map((relation) => ({ sort_order: relation.sort_order, useCase: mapUseCase(pickFirst(relation.use_cases)) }))
    .filter((entry): entry is { sort_order: number; useCase: ToolUseCase } => Boolean(entry.useCase))
    .sort((left, right) => left.sort_order - right.sort_order)
    .map((entry) => entry.useCase);

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
    useCases,
    created_at: row.created_at,
    guide_slug: null,
  };
}

function buildKey(filters: StudentsFilters, offset: number) {
  return JSON.stringify({
    scope: filters.scope,
    includeFreemium: filters.includeFreemium,
    useCaseSlugs: [...filters.useCaseSlugs].sort(),
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

  if (filters.useCaseSlugs.length > 0) {
    const hits = tool.useCases.filter((item) => filters.useCaseSlugs.includes(item.slug)).length;
    score += hits * 24;
  }

  if (tool.featured) score += 8;
  if (tool.edu_verified) score += 12;
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

function toggleItem<T>(items: T[], item: T) {
  return items.includes(item) ? items.filter((value) => value !== item) : [...items, item];
}

function getUseCaseDisplayName(useCase: ToolUseCase) {
  return USE_CASE_DISPLAY_LABELS[useCase.slug] ?? useCase.name;
}

export default function StudentsToolbar({
  initialTools,
  initialHasMore,
  initialNextOffset,
  useCases,
}: StudentsToolbarProps) {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [scopeValue, setScopeValue] = useState<"all_free" | "student_pack">("all_free");
  const [includeFreemiumValue, setIncludeFreemiumValue] = useState(false);
  const [selectedUseCases, setSelectedUseCases] = useState<string[]>([]);
  const [tools, setTools] = useState<Tool[]>(initialTools);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [nextOffset, setNextOffset] = useState<number | null>(
    initialNextOffset ?? (initialHasMore ? initialTools.length : null),
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const requestIdRef = useRef(0);
  const cacheRef = useRef<Map<string, CacheEntry>>(new Map());
  const inFlightRef = useRef<Map<string, Promise<PageResult>>>(new Map());

  useEffect(() => {
    const initialKey = buildKey(
      {
        scope: "all_free",
        includeFreemium: false,
        useCaseSlugs: [],
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

  const fetchPage = useCallback(
    async (offset: number, append: boolean, filters: StudentsFilters) => {
      const requestId = ++requestIdRef.current;
      const requestKey = buildKey(filters, offset);

      if (append) setIsLoadingMore(true);
      else setIsLoading(true);

      setErrorMessage(null);

      const cached = cacheRef.current.get(requestKey);
      if (cached && cached.expiresAt > Date.now()) {
        if (requestId !== requestIdRef.current) return;

        setTools((previous) =>
          append ? rankTools(mergeUniqueById(previous, cached.value.tools), filters) : cached.value.tools,
        );
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

          if (filters.scope === "student_pack") {
            query = query.or("plan.eq.edu_free,edu_verified.eq.true");
          }

          if (filters.useCaseSlugs.length > 0) {
            query = query.in("tool_use_cases.use_cases.slug", filters.useCaseSlugs);
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

  function buildFilters(overrides: Partial<StudentsFilters> = {}): StudentsFilters {
    return {
      scope: scopeValue,
      includeFreemium: includeFreemiumValue,
      useCaseSlugs: selectedUseCases,
      ...overrides,
    };
  }

  function handleScopeChange(nextScope: "all_free" | "student_pack") {
    if (nextScope === scopeValue) return;
    setScopeValue(nextScope);
    void fetchPage(0, false, buildFilters({ scope: nextScope }));
  }

  function handleFreemiumChange(nextFreemium: boolean) {
    if (nextFreemium === includeFreemiumValue) return;
    setIncludeFreemiumValue(nextFreemium);
    void fetchPage(0, false, buildFilters({ includeFreemium: nextFreemium }));
  }

  function handleUseCaseToggle(slug: string) {
    const next = toggleItem(selectedUseCases, slug);
    setSelectedUseCases(next);
    void fetchPage(0, false, buildFilters({ useCaseSlugs: next }));
  }

  function handleLoadMore() {
    if (!hasMore || nextOffset === null || isLoadingMore) return;
    void fetchPage(nextOffset, true, buildFilters());
  }

  function handleClear() {
    setScopeValue("all_free");
    setIncludeFreemiumValue(false);
    setSelectedUseCases([]);

    void fetchPage(0, false, {
      scope: "all_free",
      includeFreemium: false,
      useCaseSlugs: [],
    });
  }

  const hasActiveFilters =
    scopeValue === "student_pack" || includeFreemiumValue || selectedUseCases.length > 0;

  const activeFilterLabels = [
    scopeValue === "student_pack" ? "Beneficio estudiantil" : null,
    includeFreemiumValue ? "Freemium incluido" : null,
    ...selectedUseCases.map((slug) => {
      const useCase = useCases.find((item) => item.slug === slug);
      return useCase ? getUseCaseDisplayName(useCase) : slug;
    }),
  ].filter(Boolean) as string[];

  return (
    <>
      <section className="mt-6 overflow-hidden rounded-[1.5rem] ui-shell">
        <div className="border-b ui-rule bg-[linear-gradient(180deg,rgba(247,243,236,0.8)_0%,rgba(255,255,255,0.95)_100%)] px-4 py-4 md:px-6 md:py-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div className="max-w-3xl">
                <p className="ui-label">Filtro rápido</p>
                <h2 className="mt-2 text-lg font-semibold text-slate-950 md:text-[1.4rem]">
                  Encuentra acceso útil sin leer de más.
                </h2>
                <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-slate-600 md:text-sm">
                  Primero acceso real. Después aterriza el caso de uso. La idea es reducir el
                  catálogo a lo que un estudiante puede activar hoy.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-300/70 bg-white px-3 py-1.5 text-[11px] text-slate-600 shadow-[0_6px_14px_rgba(17,24,39,0.04)] md:px-4 md:py-2 md:text-xs">
                <span className="font-semibold text-slate-950">{tools.length}</span>
                {hasMore ? "+" : ""} resultados visibles
              </div>
            </div>

            <div className="grid items-start gap-4 xl:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-[1rem] border ui-rule bg-[rgba(250,249,247,0.92)] p-3.5">
                <div>
                  <p className="ui-label inline-flex items-center gap-1.5">
                    <GraduationCap className="h-3.5 w-3.5 text-sky-500" />
                    Acceso
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Prioriza la forma real de entrada antes de refinar el resto.
                  </p>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleScopeChange("all_free")}
                    aria-pressed={scopeValue === "all_free"}
                    className={`inline-flex items-center rounded-full border px-3.5 py-2 text-sm font-medium transition ${
                      scopeValue === "all_free"
                        ? "border-slate-950 bg-slate-950 text-white shadow-[0_6px_14px_rgba(17,24,39,0.1)]"
                        : "border-slate-300/70 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                    }`}
                  >
                    Gratis total
                  </button>
                  <button
                    type="button"
                    onClick={() => handleScopeChange("student_pack")}
                    aria-pressed={scopeValue === "student_pack"}
                    className={`inline-flex items-center rounded-full border px-3.5 py-2 text-sm font-medium transition ${
                      scopeValue === "student_pack"
                        ? "border-slate-950 bg-slate-950 text-white shadow-[0_6px_14px_rgba(17,24,39,0.1)]"
                        : "border-slate-300/70 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                    }`}
                  >
                    Beneficio estudiantil
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFreemiumChange(!includeFreemiumValue)}
                    aria-pressed={includeFreemiumValue}
                    className={`inline-flex items-center rounded-full border px-3.5 py-2 text-sm font-medium transition ${
                      includeFreemiumValue
                        ? "border-slate-950 bg-slate-950 text-white shadow-[0_6px_14px_rgba(17,24,39,0.1)]"
                        : "border-slate-300/70 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                    }`}
                  >
                    Incluir freemium
                  </button>
                </div>
              </div>

              <div className="rounded-[1rem] border border-slate-300/70 bg-[linear-gradient(180deg,rgba(250,249,247,0.96)_0%,rgba(255,255,255,0.96)_100%)] p-3.5 shadow-[0_8px_16px_rgba(17,24,39,0.03)]">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="inline-flex items-center gap-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                      <Layers3 className="h-3 w-3 text-sky-500" />
                      Casos de uso
                    </p>
                    <h3 className="mt-0.5 text-sm font-semibold text-slate-950">
                      Aterriza la intención.
                    </h3>
                  </div>
                  <span className="text-[11px] whitespace-nowrap text-slate-500">
                    {selectedUseCases.length > 0 ? `${selectedUseCases.length} activos` : "Todos"}
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-1.5 md:gap-2">
                  {useCases.map((useCase) => {
                    const selected = selectedUseCases.includes(useCase.slug);
                    return (
                      <button
                        key={useCase.slug}
                        type="button"
                        onClick={() => handleUseCaseToggle(useCase.slug)}
                        className={`inline-flex min-h-[2.45rem] items-center justify-center rounded-[0.85rem] border px-2 py-1.5 text-center text-[11px] font-medium leading-tight transition md:rounded-[0.9rem] md:px-3 md:text-[12.5px] ${
                          selected
                            ? "border-slate-950 bg-slate-950 text-white shadow-[0_6px_14px_rgba(17,24,39,0.1)]"
                            : "border-slate-300/70 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                        }`}
                      >
                        {getUseCaseDisplayName(useCase)}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {activeFilterLabels.length > 0 ? (
              <div className="flex flex-wrap items-center gap-2 rounded-[1rem] border ui-rule bg-[rgba(250,249,247,0.92)] px-3 py-3">
                <span className="ui-chip inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium">
                  Filtros activos
                </span>
                {activeFilterLabels.map((label) => (
                  <span
                    key={label}
                    className="ui-chip inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium"
                  >
                    {label}
                  </span>
                ))}
                <button
                  type="button"
                  onClick={handleClear}
                  className="ml-auto inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                >
                  <X className="h-3.5 w-3.5" />
                  Limpiar todo
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1rem] border ui-rule bg-[rgba(250,249,247,0.92)] px-3 py-3">
                <p className="text-sm text-slate-500">
                  Empieza por acceso y elige un caso de uso solo si quieres aterrizar más rápido.
                </p>
                <p className="text-sm text-slate-600">
                  Mostrando <span className="font-semibold text-slate-900">{tools.length}</span>
                  {hasMore ? "+" : ""} herramientas.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {errorMessage ? (
        <div className="mt-6 rounded-2xl border border-red-300/35 bg-red-400/10 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      {isLoading && tools.length === 0 ? (
        <div className="mt-8 rounded-[1rem] ui-panel px-6 py-9 text-center text-slate-700">
          Cargando herramientas...
        </div>
      ) : tools.length > 0 ? (
        <div
          className={`mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 transition-opacity duration-150 ${
            isLoading ? "pointer-events-none opacity-50" : "opacity-100"
          }`}
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
