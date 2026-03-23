import type { ToolLevel, ToolPlan } from "@/lib/types/tool";

export type CareerOption = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color_accent: string | null;
  icon_name: string | null;
  sort_order: number;
};

export type LocalFilters = {
  search: string;
  careerSlugs: string[];
  plans: ToolPlan[];
  levels: ToolLevel[];
};

export type RawCareerPathRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color_accent: string | null;
  icon_name: string | null;
  sort_order: number;
};

export type RawCareerRelation = {
  sort_order: number;
  career_paths: RawCareerPathRow | RawCareerPathRow[] | null;
};

export type RawToolRow = {
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
  created_at: string | null;
  sort_order: number | null;
  tool_careers: RawCareerRelation[] | null;
};
