import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { ToolArea, ToolUseCase } from "@/lib/types/tool";

type RawTaxonomyRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color_accent: string | null;
  icon_name: string | null;
  sort_order: number;
};

function mapTaxonomyRow(row: RawTaxonomyRow) {
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

export async function getAreas(): Promise<ToolArea[]> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("areas")
    .select("id, name, slug, description, color_accent, icon_name, sort_order")
    .eq("status", "published")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    console.error("[tool-taxonomy-repo] getAreas:", error.message);
    return [];
  }

  return ((data as RawTaxonomyRow[] | null) ?? []).map(mapTaxonomyRow);
}

export async function getUseCases(): Promise<ToolUseCase[]> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("use_cases")
    .select("id, name, slug, description, color_accent, icon_name, sort_order")
    .eq("status", "published")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    console.error("[tool-taxonomy-repo] getUseCases:", error.message);
    return [];
  }

  return ((data as RawTaxonomyRow[] | null) ?? []).map(mapTaxonomyRow);
}
