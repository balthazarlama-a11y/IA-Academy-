import type { ToolLevel, ToolPlan } from "@/lib/types/tool";

export type CareerPathSource = "career_paths" | "tool_categories";

export type CareerPath = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color_accent: string | null;
  icon_name: string | null;
  sort_order: number;
  source: CareerPathSource;
};

export type Career = CareerPath;

export type CareerFilters = {
  search?: string;
  careerSlugs?: string[];
  categorySlugs?: string[];
  plans?: ToolPlan[];
  levels?: ToolLevel[];
};
