export type ToolPlan = "free" | "freemium" | "paid" | "edu_free";
export type ToolLevel = "beginner" | "intermediate" | "advanced" | "all";

export type ToolArea = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color_accent: string | null;
  icon_name: string | null;
  sort_order: number;
};

export type ToolUseCase = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color_accent: string | null;
  icon_name: string | null;
  sort_order: number;
};

export type ToolFaqItem = {
  question: string;
  answer: string;
};

export type Tool = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  tagline: string | null;
  editorial_summary: string | null;
  url: string;
  cover_image_url: string | null;
  screenshot_url: string | null;
  demo_video_url: string | null;
  company_name: string | null;
  plan: ToolPlan;
  level: ToolLevel;
  ia_type: string | null;
  verified: boolean;
  edu_verified: boolean;
  featured: boolean;
  sort_order: number;
  platform_tags: string[];
  language_codes: string[];
  spanish_available: boolean;
  feature_bullets: string[];
  faq_items: ToolFaqItem[];
  areas: ToolArea[];
  primaryArea: ToolArea | null;
  useCases: ToolUseCase[];
  guide_slug: string | null;
  created_at: string;
};

export type ToolFilters = {
  search?: string;
  areaSlugs?: string[];
  useCaseSlugs?: string[];
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
