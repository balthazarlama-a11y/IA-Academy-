import type { ToolCareer, ToolLevel, ToolPlan } from "@/lib/types/tool";

export type CareerPathSource = "career_paths";

export type CareerPath = ToolCareer & {
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
