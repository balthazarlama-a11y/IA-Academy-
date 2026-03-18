import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Career, CareerPath, CareerPathSource } from "@/lib/types/career";
import type { ToolCategory } from "@/lib/types/tool";

type RawCareerPathRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color_accent: string | null;
  icon_name: string | null;
  sort_order: number;
};

type RawCareerToolLinkRow = {
  tool_id: string;
  career_id: string;
  sort_order: number;
};

const CAREER_PATH_SELECT = "id, name, slug, description, color_accent, icon_name, sort_order";

let hasCareerPathsSchemaCache: boolean | null = null;

function normalizeList(values: string[] | undefined | null): string[] {
  if (!values || values.length === 0) return [];
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function mapCareerPath(row: RawCareerPathRow | ToolCategory, source: CareerPathSource): CareerPath {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    color_accent: row.color_accent,
    icon_name: row.icon_name,
    sort_order: row.sort_order,
    source,
  };
}

async function hasCareerPathsSchema(): Promise<boolean> {
  if (hasCareerPathsSchemaCache !== null) {
    return hasCareerPathsSchemaCache;
  }

  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("career_paths").select("id").limit(1);

  hasCareerPathsSchemaCache = !error;
  return hasCareerPathsSchemaCache;
}

export async function getCareerPaths(): Promise<CareerPath[]> {
  const supabase = getSupabaseServerClient();

  if (await hasCareerPathsSchema()) {
    const { data, error } = await supabase
      .from("career_paths")
      .select(CAREER_PATH_SELECT)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    if (!error) {
      return (((data as RawCareerPathRow[] | null) ?? [])).map((row) =>
        mapCareerPath(row, "career_paths"),
      );
    }

    console.error("[careers-repo] getCareerPaths schema:", error.message);
  }

  const { data, error } = await supabase
    .from("tool_categories")
    .select(CAREER_PATH_SELECT)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    console.error("[careers-repo] getCareerPaths fallback:", error.message);
    return [];
  }

  return (((data as ToolCategory[] | null) ?? [])).map((row) => mapCareerPath(row, "tool_categories"));
}

export async function getCareers(): Promise<Career[]> {
  return getCareerPaths();
}

export async function resolveCareerPathToolIds(careerSlugs: string[]): Promise<string[]> {
  const slugs = normalizeList(careerSlugs);
  if (slugs.length === 0) {
    return [];
  }

  const supabase = getSupabaseServerClient();

  if (await hasCareerPathsSchema()) {
    const { data: careerRows, error: careerError } = await supabase
      .from("career_paths")
      .select("id, slug")
      .in("slug", slugs);

    if (careerError) {
      console.error("[careers-repo] resolveCareerPathToolIds careers:", careerError.message);
      return [];
    }

    const careerIds = (((careerRows as Array<{ id: string }> | null) ?? [])).map((row) => row.id);
    if (careerIds.length === 0) {
      return [];
    }

    const { data: linkRows, error: linkError } = await supabase
      .from("tool_careers")
      .select("tool_id, career_id, sort_order")
      .in("career_id", careerIds)
      .order("sort_order", { ascending: true });

    if (linkError) {
      console.error("[careers-repo] resolveCareerPathToolIds links:", linkError.message);
      return [];
    }

    return [...new Set((((linkRows as RawCareerToolLinkRow[] | null) ?? [])).map((row) => row.tool_id))];
  }

  const { data: categoryRows, error: categoryError } = await supabase
    .from("tool_categories")
    .select("id, slug")
    .in("slug", slugs);

  if (categoryError) {
    console.error("[careers-repo] resolveCareerPathToolIds fallback categories:", categoryError.message);
    return [];
  }

  const categoryIds = (((categoryRows as Array<{ id: string }> | null) ?? [])).map((row) => row.id);
  if (categoryIds.length === 0) {
    return [];
  }

  const { data: toolRows, error: toolError } = await supabase
    .from("tools")
    .select("id")
    .eq("status", "published")
    .in("category_id", categoryIds);

  if (toolError) {
    console.error("[careers-repo] resolveCareerPathToolIds fallback tools:", toolError.message);
    return [];
  }

  return [...new Set((((toolRows as Array<{ id: string }> | null) ?? [])).map((row) => row.id))];
}

export async function resolveCareerToolIds(careerSlugs: string[]): Promise<string[]> {
  return resolveCareerPathToolIds(careerSlugs);
}
