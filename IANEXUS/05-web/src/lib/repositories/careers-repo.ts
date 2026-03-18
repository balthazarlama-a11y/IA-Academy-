import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Career, CareerSource } from "@/lib/types/career";
import type { ToolCategory } from "@/lib/types/tool";

type RawCareerRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color_accent: string | null;
  icon_name: string | null;
  sort_order: number;
};

type RawCareerLinkRow = {
  tool_id: string;
  career_id: string;
  sort_order: number;
};

const CAREER_SELECT = "id, name, slug, description, color_accent, icon_name, sort_order";

let hasCareerSchemaCache: boolean | null = null;

// Keep the fallback additive: if the careers schema is not present yet,
// the frontend can still resolve the old category taxonomy until the DB merge lands.

function normalizeList(values: string[] | undefined | null): string[] {
  if (!values || values.length === 0) return [];
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function mapCareer(row: RawCareerRow | ToolCategory, source: CareerSource): Career {
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

async function hasCareerSchema(): Promise<boolean> {
  if (hasCareerSchemaCache !== null) {
    return hasCareerSchemaCache;
  }

  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("career_paths").select("id").limit(1);

  hasCareerSchemaCache = !error;
  return hasCareerSchemaCache;
}

export async function getCareers(): Promise<Career[]> {
  const supabase = getSupabaseServerClient();

  if (await hasCareerSchema()) {
    const { data, error } = await supabase
      .from("career_paths")
      .select(CAREER_SELECT)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    if (!error) {
      return (((data as RawCareerRow[] | null) ?? [])).map((row) => mapCareer(row, "career_paths"));
    }

    console.error("[careers-repo] getCareers schema:", error.message);
  }

  const { data, error } = await supabase
    .from("tool_categories")
    .select(CAREER_SELECT)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    console.error("[careers-repo] getCareers fallback:", error.message);
    return [];
  }

  return (((data as ToolCategory[] | null) ?? [])).map((row) => mapCareer(row, "tool_categories"));
}

export async function resolveCareerToolIds(careerSlugs: string[]): Promise<string[]> {
  const slugs = normalizeList(careerSlugs);
  if (slugs.length === 0) {
    return [];
  }

  const supabase = getSupabaseServerClient();

  if (await hasCareerSchema()) {
    const { data: careerRows, error: careerError } = await supabase
      .from("career_paths")
      .select("id, slug")
      .in("slug", slugs);

    if (careerError) {
      console.error("[careers-repo] resolveCareerToolIds careers:", careerError.message);
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
      console.error("[careers-repo] resolveCareerToolIds links:", linkError.message);
      return [];
    }

    return [...new Set((((linkRows as RawCareerLinkRow[] | null) ?? [])).map((row) => row.tool_id))];
  }

  const { data: categoryRows, error: categoryError } = await supabase
    .from("tool_categories")
    .select("id, slug")
    .in("slug", slugs);

  if (categoryError) {
    console.error("[careers-repo] resolveCareerToolIds fallback categories:", categoryError.message);
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
    console.error("[careers-repo] resolveCareerToolIds fallback tools:", toolError.message);
    return [];
  }

  return [...new Set((((toolRows as Array<{ id: string }> | null) ?? [])).map((row) => row.id))];
}
