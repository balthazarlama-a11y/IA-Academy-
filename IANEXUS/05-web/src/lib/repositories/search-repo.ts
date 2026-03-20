import { getCareerPaths, resolveCareerPathToolIds } from "@/lib/repositories/careers-repo";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Tool, ToolCareer, ToolLevel, ToolPlan } from "@/lib/types/tool";

type SearchFilters = {
  q?: string;
  career?: string;
  plan?: ToolPlan | "";
  iaType?: string;
};

type SearchOptions = {
  limit?: number;
};

type SearchPageData = {
  tools: Tool[];
  careers: ToolCareer[];
  iaTypes: string[];
  filters: Required<SearchFilters>;
  resultCount: number;
};

type RawCareer = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color_accent: string | null;
  icon_name: string | null;
  sort_order: number;
  source?: "career_paths" | "synthetic";
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
  career_paths: RawCareer | RawCareer[] | null;
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

const SEARCH_SELECT = [TOOL_BASE_SELECT, "post_tools(posts(slug))"].join(", ");

const TOOL_CAREER_SELECT = [
  "tool_id",
  "sort_order",
  "career_paths(id, name, slug, description, color_accent, icon_name, sort_order)",
].join(", ");

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

function pickFirst<T>(value: T | T[] | null): T | null {
  if (!value) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

function mapCareer(row: RawCareer | null): ToolCareer {
  if (!row) return FALLBACK_CAREER;

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    color_accent: row.color_accent,
    icon_name: row.icon_name,
    sort_order: row.sort_order,
    source: row.source ?? "career_paths",
  };
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

async function getCareerAssignmentsByToolIds(toolIds: string[]) {
  const assignments = new Map<string, ToolCareer[]>();
  if (toolIds.length === 0) return assignments;

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("tool_careers")
    .select(TOOL_CAREER_SELECT)
    .in("tool_id", toolIds)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[search-repo] getCareerAssignmentsByToolIds:", error.message);
    return assignments;
  }

  for (const row of (data as unknown as RawToolCareerRelation[] | null) ?? []) {
    const career = mapCareer(pickFirst(row.career_paths));
    const existing = assignments.get(row.tool_id) ?? [];
    existing.push(career);
    assignments.set(row.tool_id, existing);
  }

  return assignments;
}

async function getAvailableIaTypes() {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("tools")
    .select("ia_type")
    .eq("status", "published")
    .not("ia_type", "is", null)
    .order("ia_type", { ascending: true });

  if (error) {
    console.error("[search-repo] getAvailableIaTypes:", error.message);
    return [];
  }

  return [...new Set(((data as Array<{ ia_type: string | null }> | null) ?? []).map((row) => row.ia_type).filter(Boolean) as string[])];
}

function normalizeFilters(filters: SearchFilters): Required<SearchFilters> {
  return {
    q: cleanSearch(filters.q),
    career: (filters.career ?? "").trim(),
    plan: filters.plan ?? "",
    iaType: (filters.iaType ?? "").trim(),
  };
}

export async function getSearchPageData(
  inputFilters: SearchFilters = {},
  options: SearchOptions = {},
): Promise<SearchPageData> {
  const limit = Math.max(1, Math.min(options.limit ?? 48, 60));
  const filters = normalizeFilters(inputFilters);
  const careers = await getCareerPaths();
  const supabase = getSupabaseServerClient();

  let query = supabase
    .from("tools")
    .select(SEARCH_SELECT)
    .eq("status", "published")
    .order("featured", { ascending: false })
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (filters.career) {
    const toolIds = await resolveCareerPathToolIds([filters.career]);
    if (toolIds.length === 0) {
      return {
        tools: [],
        careers,
        iaTypes: await getAvailableIaTypes(),
        filters,
        resultCount: 0,
      };
    }
    query = query.in("id", toolIds);
  }

  if (filters.plan) {
    query = query.eq("plan", filters.plan);
  }

  if (filters.iaType) {
    query = query.eq("ia_type", filters.iaType);
  }

  if (filters.q) {
    query = query.or(
      `name.ilike.%${filters.q}%,description.ilike.%${filters.q}%,ia_type.ilike.%${filters.q}%`,
    );
  }

  const { data, error } = await query.limit(limit);

  if (error) {
    console.error("[search-repo] getSearchPageData:", error.message);
    return {
      tools: [],
      careers,
      iaTypes: await getAvailableIaTypes(),
      filters,
      resultCount: 0,
    };
  }

  const rawTools = ((data as unknown as RawTool[] | null) ?? []);
  const assignments = await getCareerAssignmentsByToolIds(rawTools.map((tool) => tool.id));
  const tools = rawTools.map((row) => buildTool(row, assignments.get(row.id) ?? []));

  return {
    tools,
    careers,
    iaTypes: await getAvailableIaTypes(),
    filters,
    resultCount: tools.length,
  };
}

export type { SearchFilters, SearchPageData };
