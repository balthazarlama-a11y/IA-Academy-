import { getSupabaseServerClient } from "@/lib/supabase/server";
import type {
  RelatedPostSummary,
  Tool,
  ToolArea,
  ToolFaqItem,
  ToolFilters,
  ToolLevel,
  ToolPlan,
  ToolUseCase,
} from "@/lib/types/tool";

export type {
  RelatedPostSummary,
  Tool,
  ToolArea,
  ToolFaqItem,
  ToolFilters,
  ToolLevel,
  ToolPlan,
  ToolUseCase,
};

type RawArea = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color_accent: string | null;
  icon_name: string | null;
  sort_order: number;
};

type RawUseCase = RawArea;

type RawToolRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  tagline: string | null;
  editorial_summary: string | null;
  url: string;
  cover_image_url: string | null;
  screenshot_url: string | null;
  demo_video_url: string | null;
  company_name: string | null;
  plan: ToolPlan;
  level: ToolLevel;
  ia_type: string | null;
  verified: boolean;
  edu_verified: boolean;
  featured: boolean;
  sort_order: number;
  platform_tags: string[] | null;
  language_codes: string[] | null;
  spanish_available: boolean | null;
  feature_bullets: string[] | null;
  faq_items: ToolFaqItem[] | null;
  created_at: string;
  tool_areas:
    | {
        sort_order: number;
        areas: RawArea | RawArea[] | null;
      }[]
    | null;
  tool_use_cases:
    | {
        sort_order: number;
        use_cases: RawUseCase | RawUseCase[] | null;
      }[]
    | null;
  post_tools?: Array<{ posts: { slug: string | null } | { slug: string | null }[] | null }> | null;
};

type ToolsPageOptions = {
  limit?: number;
  offset?: number;
};

export type ToolsPage = {
  tools: Tool[];
  hasMore: boolean;
  nextOffset: number | null;
};

const TOOL_SELECT = [
  "id",
  "name",
  "slug",
  "description",
  "tagline",
  "editorial_summary",
  "url",
  "cover_image_url",
  "screenshot_url",
  "demo_video_url",
  "company_name",
  "plan",
  "level",
  "ia_type",
  "verified",
  "edu_verified",
  "featured",
  "sort_order",
  "platform_tags",
  "language_codes",
  "spanish_available",
  "feature_bullets",
  "faq_items",
  "created_at",
  "tool_areas(sort_order, areas(id, name, slug, description, color_accent, icon_name, sort_order))",
  "tool_use_cases(sort_order, use_cases(id, name, slug, description, color_accent, icon_name, sort_order))",
  "post_tools(posts(slug))",
].join(", ");

const CATALOG_LIMIT = 500;
const CACHE_TTL_MS = 90_000;

type CatalogCacheEntry = {
  expiresAt: number;
  value: Tool[];
};

const catalogCache = new Map<string, CatalogCacheEntry>();
const inFlightCatalog = new Map<string, Promise<Tool[]>>();

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

function normalizeList(values: string[] | undefined | null): string[] {
  if (!values || values.length === 0) return [];
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function cleanSearch(value: string | undefined) {
  return (value ?? "").trim().replaceAll(",", " ");
}

function pickFirst<T>(value: T | T[] | null): T | null {
  if (!value) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

function mapArea(row: RawArea | null): ToolArea | null {
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

function buildTool(row: RawToolRow): Tool {
  const areas = (row.tool_areas ?? [])
    .map((relation) => ({ sort_order: relation.sort_order, area: mapArea(pickFirst(relation.areas)) }))
    .filter((entry): entry is { sort_order: number; area: ToolArea } => Boolean(entry.area))
    .sort((left, right) => left.sort_order - right.sort_order)
    .map((entry) => entry.area);

  const useCases = (row.tool_use_cases ?? [])
    .map((relation) => ({ sort_order: relation.sort_order, useCase: mapUseCase(pickFirst(relation.use_cases)) }))
    .filter((entry): entry is { sort_order: number; useCase: ToolUseCase } => Boolean(entry.useCase))
    .sort((left, right) => left.sort_order - right.sort_order)
    .map((entry) => entry.useCase);

  const guideSlug = (() => {
    for (const relation of row.post_tools ?? []) {
      const post = pickFirst(relation.posts);
      if (post?.slug) return post.slug;
    }
    return null;
  })();

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    tagline: row.tagline,
    editorial_summary: row.editorial_summary,
    url: row.url,
    cover_image_url: row.cover_image_url,
    screenshot_url: row.screenshot_url,
    demo_video_url: row.demo_video_url,
    company_name: row.company_name,
    plan: row.plan,
    level: row.level,
    ia_type: row.ia_type,
    verified: row.verified,
    edu_verified: row.edu_verified,
    featured: row.featured,
    sort_order: row.sort_order,
    platform_tags: normalizeList(row.platform_tags),
    language_codes: normalizeList(row.language_codes),
    spanish_available: Boolean(row.spanish_available),
    feature_bullets: normalizeList(row.feature_bullets),
    faq_items: Array.isArray(row.faq_items)
      ? row.faq_items.filter((item) => item && typeof item.question === "string" && typeof item.answer === "string")
      : [],
    areas,
    primaryArea: areas[0] ?? null,
    useCases,
    guide_slug: guideSlug,
    created_at: row.created_at,
  };
}

async function fetchPublishedCatalog(): Promise<Tool[]> {
  const cacheKey = "published-catalog";
  const cached = catalogCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.value;
  }

  const existing = inFlightCatalog.get(cacheKey);
  if (existing) return existing;

  const task = (async () => {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("tools")
      .select(TOOL_SELECT)
      .eq("status", "published")
      .order("featured", { ascending: false })
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false })
      .limit(CATALOG_LIMIT);

    if (error) {
      console.error("[tools-repo] fetchPublishedCatalog:", error.message);
      return [];
    }

    const tools = (((data as unknown) as RawToolRow[] | null) ?? []).map(buildTool);
    catalogCache.set(cacheKey, { expiresAt: Date.now() + CACHE_TTL_MS, value: tools });
    return tools;
  })();

  inFlightCatalog.set(cacheKey, task);
  try {
    return await task;
  } finally {
    inFlightCatalog.delete(cacheKey);
  }
}

function matchesSearch(tool: Tool, query: string) {
  if (!query) return true;
  const normalized = normalizeText(query);
  if (!normalized) return true;

  const haystack = normalizeText([
    tool.name,
    tool.slug,
    tool.description,
    tool.tagline,
    tool.company_name,
    tool.ia_type,
    tool.platform_tags.join(" "),
    tool.language_codes.join(" "),
    tool.areas.map((area) => `${area.name} ${area.slug}`).join(" "),
    tool.useCases.map((useCase) => `${useCase.name} ${useCase.slug}`).join(" "),
    tool.feature_bullets.join(" "),
  ].filter(Boolean).join(" "));

  return haystack.includes(normalized);
}

function filterTools(catalog: Tool[], filters: ToolFilters) {
  const areaSlugs = normalizeList(filters.areaSlugs);
  const useCaseSlugs = normalizeList(filters.useCaseSlugs);
  const plans = normalizeList(filters.plans);
  const levels = normalizeList(filters.levels);
  const search = cleanSearch(filters.search);

  return catalog.filter((tool) => {
    if (areaSlugs.length > 0 && !tool.areas.some((area) => areaSlugs.includes(area.slug))) {
      return false;
    }

    if (useCaseSlugs.length > 0 && !tool.useCases.some((useCase) => useCaseSlugs.includes(useCase.slug))) {
      return false;
    }

    if (plans.length > 0 && !plans.includes(tool.plan)) {
      return false;
    }

    if (levels.length > 0 && !levels.includes(tool.level)) {
      return false;
    }

    if (filters.onlyFree && !["free", "edu_free"].includes(tool.plan)) {
      return false;
    }

    if (filters.onlyEdu && !(tool.plan === "edu_free" || tool.edu_verified)) {
      return false;
    }

    return matchesSearch(tool, search);
  });
}

export async function getTools(filters: ToolFilters = {}): Promise<Tool[]> {
  const filtered = filterTools(await fetchPublishedCatalog(), filters);
  const limit = filters.limit && filters.limit > 0 ? filters.limit : filtered.length;
  return filtered.slice(0, limit);
}

export async function getToolsPage(filters: ToolFilters = {}, options: ToolsPageOptions = {}): Promise<ToolsPage> {
  const filtered = filterTools(await fetchPublishedCatalog(), filters);
  const limit = Math.max(1, Math.min(options.limit ?? 50, 100));
  const offset = Math.max(0, options.offset ?? 0);
  const tools = filtered.slice(offset, offset + limit);
  const hasMore = offset + limit < filtered.length;

  return {
    tools,
    hasMore,
    nextOffset: hasMore ? offset + limit : null,
  };
}

export async function getToolBySlug(slug: string): Promise<Tool | null> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("tools")
    .select(TOOL_SELECT)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    console.error("[tools-repo] getToolBySlug:", error.message);
    return null;
  }

  if (!data) return null;
  return buildTool((data as unknown) as RawToolRow);
}
