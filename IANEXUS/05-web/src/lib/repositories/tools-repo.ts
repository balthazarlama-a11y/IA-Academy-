import { getSupabaseServerClient } from "@/lib/supabase/server";
import type {
  RelatedPostSummary,
  Tool,
  ToolCategory,
  ToolFilters,
  ToolLevel,
  ToolPlan,
} from "@/lib/types/tool";

export type {
  RelatedPostSummary,
  Tool,
  ToolCategory,
  ToolFilters,
  ToolLevel,
  ToolPlan,
};

type RawCategory = {
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
  tool_categories: RawCategory | null;
  post_tools?: Array<{ posts: { slug: string } | null }> | null;
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

const LIST_TOOLS_SELECT = [
  "id, name, slug, description, url, cover_image_url, plan, level, ia_type, verified, edu_verified, featured, sort_order, created_at",
  "tool_categories(id, name, slug, description, color_accent, icon_name, sort_order)",
].join(", ");

const AREAS_LIST_TOOLS_SELECT = [
  "id, name, slug, description, url, cover_image_url, plan, level, ia_type, verified, edu_verified, featured",
  "tool_categories(id, name, slug, description, color_accent, icon_name, sort_order)",
].join(", ");

const DETAIL_TOOLS_SELECT = [
  "id, name, slug, description, url, cover_image_url, plan, level, ia_type, verified, edu_verified, featured, sort_order, created_at",
  "tool_categories(id, name, slug, description, color_accent, icon_name, sort_order)",
  "post_tools(posts(slug))",
].join(", ");

const TOOLS_PAGE_SIZE = 50;
const TOOLS_CACHE_TTL_MS = 90_000;

type ToolsPageCacheEntry = {
  expiresAt: number;
  value: ToolsPage;
};

const toolsPageCache = new Map<string, ToolsPageCacheEntry>();
const inFlightToolsPage = new Map<string, Promise<ToolsPage>>();

function cleanSearch(value: string | undefined) {
  return (value ?? "").trim().replaceAll(",", " ");
}

function buildToolsPageCacheKey(filters: ToolFilters, limit: number, offset: number) {
  const normalized = {
    categorySlug: filters.categorySlug ?? "",
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

function mapCategory(row: RawCategory | null): ToolCategory {
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

function mapTool(row: RawTool): Tool {
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
    category: mapCategory(row.tool_categories),
    guide_slug: row.post_tools?.[0]?.posts?.slug ?? null,
  };
}

function mapAreasTool(row: RawTool): Tool {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    url: row.url,
    cover_image_url: row.cover_image_url ?? null,
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

export async function getTools(filters: ToolFilters = {}): Promise<Tool[]> {
  const supabase = getSupabaseServerClient();

  let query = supabase
    .from("tools")
    .select(LIST_TOOLS_SELECT)
    .eq("status", "published")
    .order("featured", { ascending: false })
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (filters.categorySlug) {
    query = query.eq("tool_categories.slug", filters.categorySlug);
  }

  if (filters.onlyFree) {
    query = query.in("plan", ["free", "edu_free"]);
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

  if (filters.limit && filters.limit > 0) {
    query = query.limit(filters.limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("[tools-repo] getTools:", error.message);
    return [];
  }

  return ((data as unknown as RawTool[]) ?? []).map(mapTool);
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
    const supabase = getSupabaseServerClient();

    let query = supabase
      .from("tools")
      .select(LIST_TOOLS_SELECT)
      .eq("status", "published")
      .order("featured", { ascending: false })
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (filters.categorySlug) {
      query = query.eq("tool_categories.slug", filters.categorySlug);
    }

    if (filters.onlyFree) {
      query = query.in("plan", ["free", "edu_free"]);
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

    query = query.range(offset, offset + limit - 1);

    const { data, error } = await query;

    if (error) {
      console.error("[tools-repo] getToolsPage:", error.message);
      return { tools: [], hasMore: false, nextOffset: null };
    }

    const rows = ((data as unknown as RawTool[]) ?? []).map(mapTool);
    const hasMore = rows.length === limit;

    const pageResult = {
      tools: rows,
      hasMore,
      nextOffset: hasMore ? offset + limit : null,
    };

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
    const supabase = getSupabaseServerClient();

    let query = supabase
      .from("tools")
      .select(AREAS_LIST_TOOLS_SELECT)
      .eq("status", "published")
      .order("featured", { ascending: false })
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (filters.categorySlug) {
      query = query.eq("tool_categories.slug", filters.categorySlug);
    }

    if (filters.onlyFree) {
      query = query.in("plan", ["free", "edu_free"]);
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

    query = query.range(offset, offset + limit - 1);

    const { data, error } = await query;

    if (error) {
      console.error("[tools-repo] getAreasToolsPage:", error.message);
      return { tools: [], hasMore: false, nextOffset: null };
    }

    const rows = ((data as unknown as RawTool[]) ?? []).map(mapAreasTool);
    const hasMore = rows.length === limit;

    const pageResult = {
      tools: rows,
      hasMore,
      nextOffset: hasMore ? offset + limit : null,
    };

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

  return mapTool(data as unknown as RawTool);
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

// Backward-compatible helper used by pages/components already connected.
export async function fetchPublishedTools(): Promise<Tool[]> {
  return getTools();
}
