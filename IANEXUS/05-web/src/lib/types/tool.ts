export type ToolPlan = "free" | "freemium" | "paid" | "edu_free";
export type ToolLevel = "beginner" | "intermediate" | "advanced" | "all";
export type ToolTaxonomySource = "career_paths" | "synthetic";

export type ToolCareer = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color_accent: string | null;
  icon_name: string | null;
  sort_order: number;
  source?: ToolTaxonomySource;
};

// Deprecated compatibility alias kept only for leaf UI that still reads `tool.category`.
export type ToolCategory = ToolCareer;

export type Tool = {
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
  sort_order: number;
  careers?: ToolCareer[];
  primaryCareer?: ToolCareer;
  category: ToolCategory;
  guide_slug: string | null;
  created_at: string;
};

export type ToolFilters = {
  search?: string;
  // Deprecated transitional alias. Prefer `careerSlugs`.
  categorySlug?: string;
  careerSlugs?: string[];
  plans?: ToolPlan[];
  levels?: ToolLevel[];
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
