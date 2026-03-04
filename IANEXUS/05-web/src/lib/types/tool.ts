export type ToolPlan = "free" | "freemium" | "paid" | "edu_free";
export type ToolLevel = "beginner" | "intermediate" | "advanced" | "all";

export type ToolCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color_accent: string | null;
  icon_name: string | null;
  sort_order: number;
};

export type Tool = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  url: string;
  logo_url: string | null;
  plan: ToolPlan;
  level: ToolLevel;
  ia_type: string | null;
  verified: boolean;
  edu_verified: boolean;
  featured: boolean;
  sort_order: number;
  category: ToolCategory;
  guide_slug: string | null;
  created_at: string;
};

export type ToolFilters = {
  search?: string;
  categorySlug?: string;
  onlyFree?: boolean;
  onlyEdu?: boolean;
  limit?: number;
};

export type RelatedPostSummary = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  publishedAt: string | null;
  sortOrder: number;
};
