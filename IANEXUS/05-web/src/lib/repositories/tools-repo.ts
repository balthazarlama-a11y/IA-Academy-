import { resolveCareerPathToolIds } from "@/lib/repositories/careers-repo";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type {
  RelatedPostSummary,
  Tool,
  ToolCareer,
  ToolCategory,
  ToolFilters,
  ToolLevel,
  ToolPlan,
} from "@/lib/types/tool";

export type {
  RelatedPostSummary,
  Tool,
  ToolCareer,
  ToolCategory,
  ToolFilters,
  ToolLevel,
  ToolPlan,
};

type RawCareer = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color_accent: string | null;
  icon_name: string | null;
  sort_order: number;
};

type RawTool = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  url: string;
  cover_image_url: string | null;
  plan: ToolPlan;
  level: ToolLevel;
  ia_type: string | null;
  verified: boolean;
  edu_verified: boolean;
  featured: boolean;
  sort_order: number;
  created_at: string;
  post_tools?: Array<{ posts: { slug: string } | null }> | null;
};

type RawToolCareerRelation = {
  tool_id: string;
  sort_order: number;
  career_paths:
    | RawCareer
    | RawCareer[]
    | null;
};

type RawPostRelation = {
  sort_order: number;
  posts:
    | {
        id: string;
        slug: string;
        title: string;
        excerpt: string | null;
        published_at: string | null;
      }
    | {
        id: string;
        slug: string;
        title: string;
        excerpt: string | null;
        published_at: string | null;
      }[]
    | null;
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

const TOOL_BASE_SELECT = [
  "id",
  "name",
  "slug",
  "description",
  "url",
  "cover_image_url",
  "plan",
  "level",
  "ia_type",
  "verified",
  "edu_verified",
  "featured",
  "sort_order",
  "created_at",
].join(", ");

const DETAIL_TOOLS_SELECT = [TOOL_BASE_SELECT, "post_tools(posts(slug))"].join(", ");

const TOOL_CAREER_SELECT = [
  "tool_id",
  "sort_order",
  "career_paths(id, name, slug, description, color_accent, icon_name, sort_order)",
].join(", ");

const TOOLS_PAGE_SIZE = 50;
const TOOLS_CACHE_TTL_MS = 90_000;

type ToolsPageCacheEntry = {
  expiresAt: number;
  value: ToolsPage;
};

const toolsPageCache = new Map<string, ToolsPageCacheEntry>();
const inFlightToolsPage = new Map<string, Promise<ToolsPage>>();

const FALLBACK_CAREER: ToolCareer = {
  id: "general",
  name: "General",
  slug: "general",
  description: "Clasificacion general mientras una tool termina de asociarse a una carrera.",
  color_accent: null,
  icon_name: null,
  sort_order: 0,
  source: "synthetic",
};

function cleanSearch(value: string | undefined) {
  return (value ?? "").trim().replaceAll(",", " ");
}

function normalizeList(values: string[] | undefined | null): string[] {
  if (!values || values.length === 0) return [];
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function normalizeCareerSlugs(filters: ToolFilters): string[] {
  const careerSlugs = normalizeList(filters.careerSlugs);
  if (careerSlugs.length > 0) {
    return careerSlugs;
  }

  return filters.categorySlug ? [filters.categorySlug.trim()] : [];
}

function buildToolsPageCacheKey(filters: ToolFilters, limit: number, offset: number) {
  const normalized = {
    careerSlugs: normalizeCareerSlugs(filters),
    plans: normalizeList(filters.plans),
    levels: normalizeList(filters.levels),
    onlyFree: Boolean(filters.onlyFree),
    onlyEdu: Boolean(filters.onlyEdu),
    search: cleanSearch(filters.search).toLowerCase(),
    limit,
    offset,
  };

  return JSON.stringify(normalized);
}

function getCachedToolsPage(key: string): ToolsPage | null {
  const cached = toolsPageCache.get(key);
  if (!cached) return null;

  if (cached.expiresAt < Date.now()) {
    toolsPageCache.delete(key);
    return null;
  }

  return cached.value;
}

function pickFirst<T>(value: T | T[] | null): T | null {
  if (!value) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

function mapCareer(row: RawCareer | null): ToolCareer {
  if (!row) {
    return FALLBACK_CAREER;
  }

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    color_accent: row.color_accent,
    icon_name: row.icon_name,
    sort_order: row.sort_order,
    source: "career_paths",
  };
}

async function getCareerAssignmentsByToolIds(toolIds: string[]): Promise<Map<string, ToolCareer[]>> {
  const assignments = new Map<string, ToolCareer[]>();
  if (toolIds.length === 0) {
    return assignments;
  }

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("tool_careers")
    .select(TOOL_CAREER_SELECT)
    .in("tool_id", toolIds)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[tools-repo] getCareerAssignmentsByToolIds:", error.message);
    return assignments;
  }

  for (const row of ((data as unknown as RawToolCareerRelation[] | null) ?? [])) {
    const career = mapCareer(pickFirst(row.career_paths));
    const existing = assignments.get(row.tool_id) ?? [];
    existing.push(career);
    assignments.set(row.tool_id, existing);
  }

  return assignments;
}

function buildTool(row: RawTool, careers: ToolCareer[]): Tool {
  const resolvedCareers = careers.length > 0 ? careers : [FALLBACK_CAREER];
  const primaryCareer = resolvedCareers[0];

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    url: row.url,
    cover_image_url: row.cover_image_url,
    plan: row.plan,
    level: row.level,
    ia_type: row.ia_type,
    verified: row.verified,
    edu_verified: row.edu_verified,
    featured: row.featured,
    sort_order: row.sort_order,
    created_at: row.created_at,
    careers: resolvedCareers,
    primaryCareer,
    category: primaryCareer,
    guide_slug: row.post_tools?.[0]?.posts?.slug ?? null,
  };
}

async function runToolsQuery(
  selectClause: string,
  filters: ToolFilters,
  options: { limit?: number; offset?: number; paginate?: boolean } = {},
): Promise<ToolsPage> {
  const supabase = getSupabaseServerClient();
  const limit = Math.min(TOOLS_PAGE_SIZE, Math.max(1, options.limit ?? TOOLS_PAGE_SIZE));
  const offset = Math.max(0, options.offset ?? 0);

  let query = supabase
    .from("tools")
    .select(selectClause)
    .eq("status", "published")
    .order("featured", { ascending: false })
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  const careerSlugs = normalizeCareerSlugs(filters);
  if (careerSlugs.length > 0) {
    const toolIds = await resolveCareerPathToolIds(careerSlugs);
    if (toolIds.length === 0) {
      return { tools: [], hasMore: false, nextOffset: null };
    }

    query = query.in("id", toolIds);
  }

  const plans = normalizeList(filters.plans);
  if (plans.length > 0) {
    query = query.in("plan", plans);
  } else if (filters.onlyFree) {
    query = query.in("plan", ["free", "edu_free"]);
  }

  const levels = normalizeList(filters.levels);
  if (levels.length > 0) {
    query = query.in("level", levels);
  }

  if (filters.onlyEdu) {
    query = query.or("plan.eq.edu_free,edu_verified.eq.true");
  }

  if (filters.search) {
    const normalized = cleanSearch(filters.search);
    if (normalized.length > 0) {
      query = query.or(`name.ilike.%${normalized}%,ia_type.ilike.%${normalized}%,description.ilike.%${normalized}%`);
    }
  }

  if (options.paginate !== false) {
    query = query.range(offset, offset + limit - 1);
  } else if (filters.limit && filters.limit > 0) {
    query = query.limit(filters.limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("[tools-repo] runToolsQuery:", error.message);
    return { tools: [], hasMore: false, nextOffset: null };
  }

  const rows = (data as unknown as RawTool[] | null) ?? [];
  const toolIds = rows.map((row) => row.id);
  const careerAssignments = await getCareerAssignmentsByToolIds(toolIds);
  const tools = rows.map((row) => buildTool(row, careerAssignments.get(row.id) ?? []));
  const hasMore = options.paginate !== false && tools.length === limit;

  return {
    tools,
    hasMore,
    nextOffset: hasMore ? offset + limit : null,
  };
}

export async function getTools(filters: ToolFilters = {}): Promise<Tool[]> {
  const page = await runToolsQuery(DETAIL_TOOLS_SELECT, filters, { paginate: false, limit: filters.limit });
  return page.tools;
}

export async function getToolsPage(
  filters: ToolFilters = {},
  options: ToolsPageOptions = {},
): Promise<ToolsPage> {
  const limit = Math.min(TOOLS_PAGE_SIZE, Math.max(1, options.limit ?? TOOLS_PAGE_SIZE));
  const offset = Math.max(0, options.offset ?? 0);
  const cacheKey = buildToolsPageCacheKey(filters, limit, offset);

  const cached = getCachedToolsPage(cacheKey);
  if (cached) {
    return cached;
  }

  const existingRequest = inFlightToolsPage.get(cacheKey);
  if (existingRequest) {
    return existingRequest;
  }

  const request = (async () => {
    const pageResult = await runToolsQuery(TOOL_BASE_SELECT, filters, { limit, offset, paginate: true });

    toolsPageCache.set(cacheKey, {
      expiresAt: Date.now() + TOOLS_CACHE_TTL_MS,
      value: pageResult,
    });

    return pageResult;
  })();

  inFlightToolsPage.set(cacheKey, request);

  try {
    return await request;
  } finally {
    inFlightToolsPage.delete(cacheKey);
  }
}

export async function getAreasToolsPage(
  filters: ToolFilters = {},
  options: ToolsPageOptions = {},
): Promise<ToolsPage> {
  const limit = Math.min(TOOLS_PAGE_SIZE, Math.max(1, options.limit ?? TOOLS_PAGE_SIZE));
  const offset = Math.max(0, options.offset ?? 0);
  const cacheKey = `areas:${buildToolsPageCacheKey(filters, limit, offset)}`;

  const cached = getCachedToolsPage(cacheKey);
  if (cached) {
    return cached;
  }

  const existingRequest = inFlightToolsPage.get(cacheKey);
  if (existingRequest) {
    return existingRequest;
  }

  const request = (async () => {
    const pageResult = await runToolsQuery(TOOL_BASE_SELECT, filters, { limit, offset, paginate: true });

    toolsPageCache.set(cacheKey, {
      expiresAt: Date.now() + TOOLS_CACHE_TTL_MS,
      value: pageResult,
    });

    return pageResult;
  })();

  inFlightToolsPage.set(cacheKey, request);

  try {
    return await request;
  } finally {
    inFlightToolsPage.delete(cacheKey);
  }
}

export async function getToolBySlug(slug: string): Promise<Tool | null> {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("tools")
    .select(DETAIL_TOOLS_SELECT)
    .eq("status", "published")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("[tools-repo] getToolBySlug:", error.message);
    return null;
  }

  if (!data) {
    return null;
  }

  const row = data as unknown as RawTool;
  const careerAssignments = await getCareerAssignmentsByToolIds([row.id]);

  return buildTool(row, careerAssignments.get(row.id) ?? []);
}

export async function getRelatedPostsByTool(
  toolId: string,
): Promise<RelatedPostSummary[]> {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("post_tools")
    .select("sort_order, posts(id, slug, title, excerpt, published_at)")
    .eq("tool_id", toolId)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[tools-repo] getRelatedPostsByTool:", error.message);
    return [];
  }

  return (((data as unknown as RawPostRelation[]) ?? []))
    .map((row) => ({
      post: Array.isArray(row.posts) ? row.posts[0] : row.posts,
      sortOrder: row.sort_order,
    }))
    .filter((row) => Boolean(row.post))
    .map((row) => ({
      id: row.post!.id,
      slug: row.post!.slug,
      title: row.post!.title,
      excerpt: row.post!.excerpt,
      publishedAt: row.post!.published_at,
      sortOrder: row.sortOrder,
    }));
}

export async function fetchPublishedTools(): Promise<Tool[]> {
  return getTools();
}
