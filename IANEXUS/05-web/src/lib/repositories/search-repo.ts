import { getCareerPaths } from "@/lib/repositories/careers-repo";
import { compareToolsByEditorialPriority, normalizeSearchText, scoreToolRelevance } from "@/lib/repositories/search-ranking";
import { getTools } from "@/lib/repositories/tools-repo";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Tool, ToolCareer, ToolPlan } from "@/lib/types/tool";

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

function cleanSearch(value: string | undefined) {
  return (value ?? "").trim().replaceAll(",", " ");
}

function normalizeFilters(filters: SearchFilters): Required<SearchFilters> {
  return {
    q: cleanSearch(filters.q),
    career: (filters.career ?? "").trim(),
    plan: filters.plan ?? "",
    iaType: (filters.iaType ?? "").trim(),
  };
}

function matchesIaType(tool: Tool, iaType: string) {
  if (!iaType) return true;
  return normalizeSearchText(tool.ia_type) === normalizeSearchText(iaType);
}

function applySearchOrdering(tools: Tool[], query: string) {
  if (!query) {
    return [...tools].sort(compareToolsByEditorialPriority);
  }

  return [...tools]
    .map((tool) => ({ tool, score: scoreToolRelevance(tool, query) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => {
      if (a.score !== b.score) return b.score - a.score;
      return compareToolsByEditorialPriority(a.tool, b.tool);
    })
    .map(({ tool }) => tool);
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

export async function getSearchPageData(
  inputFilters: SearchFilters = {},
  options: SearchOptions = {},
): Promise<SearchPageData> {
  const limit = Math.max(1, Math.min(options.limit ?? 48, 60));
  const filters = normalizeFilters(inputFilters);
  const careers = await getCareerPaths();

  const structuralFilters: Parameters<typeof getTools>[0] = {};
  if (filters.career) {
    structuralFilters.careerSlugs = [filters.career];
  }
  if (filters.plan) {
    structuralFilters.plans = [filters.plan];
  }

  let tools = await getTools(structuralFilters);
  tools = tools.filter((tool) => matchesIaType(tool, filters.iaType));
  tools = applySearchOrdering(tools, filters.q);

  return {
    tools: tools.slice(0, limit),
    careers,
    iaTypes: await getAvailableIaTypes(),
    filters,
    resultCount: tools.length,
  };
}

export type { SearchFilters, SearchPageData };
