import { getSupabaseServerClient } from "@/lib/supabase/server";
import { resolveCareerPathToolIds } from "@/lib/repositories/careers-repo";
import type { CareerFilters as BaseCareerFilters } from "@/lib/types/career";
import type { Tool, ToolCategory, ToolLevel, ToolPlan } from "@/lib/types/tool";

export type { ToolLevel, ToolPlan };
export type CareerFilters = BaseCareerFilters;
export type AreaFilters = CareerFilters;

export type CareerPage = {
  tools: Tool[];
  hasMore: boolean;
  nextOffset: number | null;
};

export type AreasPage = CareerPage;

const PAGE_SIZE = 50;

const CAREER_SELECT = [
  "id, name, slug, description, url, cover_image_url, plan, level, ia_type, verified, edu_verified, featured, category_id",
  "tool_categories(id, name, slug, description, color_accent, icon_name, sort_order)",
].join(", ");

type RawCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color_accent: string | null;
  icon_name: string | null;
  sort_order: number;
};

type RawCareerTool = {
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
  category_id: string;
  tool_categories: RawCategory | null;
};

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

  return row;
}

function mapTool(row: RawCareerTool): Tool {
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

function sanitizeSearch(value: string) {
  return value.trim().replaceAll(",", " ");
}

function normalizeList(values: string[] | undefined | null): string[] {
  if (!values || values.length === 0) return [];
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

export async function getCareerPage(
  filters: CareerFilters = {},
  options: { limit?: number; offset?: number } = {},
): Promise<CareerPage> {
  const limit = Math.min(PAGE_SIZE, Math.max(1, options.limit ?? PAGE_SIZE));
  const offset = Math.max(0, options.offset ?? 0);
  const supabase = getSupabaseServerClient();

  let query = supabase
    .from("tools")
    .select(CAREER_SELECT)
    .eq("status", "published")
    .order("featured", { ascending: false })
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  const careerSlugs = normalizeList(filters.careerSlugs ?? filters.categorySlugs);
  if (careerSlugs.length > 0) {
    const careerToolIds = await resolveCareerPathToolIds(careerSlugs);

    if (careerToolIds.length === 0) {
      return { tools: [], hasMore: false, nextOffset: null };
    }

    query = query.in("id", careerToolIds);
  }

  const plans = normalizeList(filters.plans);
  if (plans.length > 0) {
    query = query.in("plan", plans);
  }

  const levels = normalizeList(filters.levels);
  if (levels.length > 0) {
    query = query.in("level", levels);
  }

  if (filters.search) {
    const s = sanitizeSearch(filters.search);
    if (s.length > 0) {
      query = query.or(
        `name.ilike.%${s}%,description.ilike.%${s}%,ia_type.ilike.%${s}%`,
      );
    }
  }

  query = query.range(offset, offset + limit - 1);

  const { data, error } = await query;

  if (error) {
    console.error("[areas-repo] getCareerPage:", error.message);
    return { tools: [], hasMore: false, nextOffset: null };
  }

  const rows = ((data as unknown as RawCareerTool[]) ?? []).map(mapTool);
  const hasMore = rows.length === limit;

  return {
    tools: rows,
    hasMore,
    nextOffset: hasMore ? offset + limit : null,
  };
}

export async function getAreasPage(
  filters: CareerFilters = {},
  options: { limit?: number; offset?: number } = {},
): Promise<AreasPage> {
  return getCareerPage(filters, options);
}

export async function getCareerToolsPage(
  filters: CareerFilters = {},
  options: { limit?: number; offset?: number } = {},
): Promise<CareerPage> {
  return getCareerPage(filters, options);
}
