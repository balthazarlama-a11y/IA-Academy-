import { getAreasToolsPage } from "@/lib/repositories/tools-repo";
import type { CareerFilters as BaseCareerFilters } from "@/lib/types/career";
import type { Tool, ToolLevel, ToolPlan, ToolFilters } from "@/lib/types/tool";

export type { ToolLevel, ToolPlan };
export type CareerFilters = BaseCareerFilters;
export type AreaFilters = CareerFilters;

export type CareerPage = {
  tools: Tool[];
  hasMore: boolean;
  nextOffset: number | null;
};

export type AreasPage = CareerPage;

function normalizeList(values: string[] | undefined | null): string[] {
  if (!values || values.length === 0) return [];
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function mapFilters(filters: CareerFilters): ToolFilters {
  const careerSlugs = normalizeList(filters.careerSlugs ?? filters.categorySlugs);

  return {
    search: filters.search,
    careerSlugs,
    categorySlug: careerSlugs[0],
    plans: filters.plans,
    levels: filters.levels,
  };
}

export async function getCareerPage(
  filters: CareerFilters = {},
  options: { limit?: number; offset?: number } = {},
): Promise<CareerPage> {
  return getAreasToolsPage(mapFilters(filters), options);
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
