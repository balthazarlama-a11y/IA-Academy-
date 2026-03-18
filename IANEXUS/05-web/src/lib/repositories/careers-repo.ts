import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Career, CareerPath } from "@/lib/types/career";

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
  career_path_id: string;
  sort_order: number;
};

const CAREER_PATH_SELECT = [
  "id",
  "name",
  "slug",
  "description",
  "color_accent",
  "icon_name",
  "sort_order",
].join(", ");

function normalizeList(values: string[] | undefined | null): string[] {
  if (!values || values.length === 0) return [];
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function mapCareerPath(row: RawCareerPathRow): CareerPath {
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

export async function getCareerPaths(): Promise<CareerPath[]> {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("career_paths")
    .select(CAREER_PATH_SELECT)
    .eq("status", "published")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    console.error("[careers-repo] getCareerPaths:", error.message);
    return [];
  }

  return ((((data as unknown as RawCareerPathRow[] | null) ?? []))).map(mapCareerPath);
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
  const { data: careerRows, error: careerError } = await supabase
    .from("career_paths")
    .select("id, slug")
    .eq("status", "published")
    .in("slug", slugs);

  if (careerError) {
    console.error("[careers-repo] resolveCareerPathToolIds careers:", careerError.message);
    return [];
  }

  const careerIds = ((((careerRows as unknown as Array<{ id: string }> | null) ?? []))).map((row) => row.id);
  if (careerIds.length === 0) {
    return [];
  }

  const { data: linkRows, error: linkError } = await supabase
    .from("tool_careers")
    .select("tool_id, career_path_id, sort_order")
    .in("career_path_id", careerIds)
    .order("sort_order", { ascending: true });

  if (linkError) {
    console.error("[careers-repo] resolveCareerPathToolIds links:", linkError.message);
    return [];
  }

  return [...new Set((((linkRows as unknown as RawCareerToolLinkRow[] | null) ?? [])).map((row) => row.tool_id))];
}

export async function resolveCareerToolIds(careerSlugs: string[]): Promise<string[]> {
  return resolveCareerPathToolIds(careerSlugs);
}
