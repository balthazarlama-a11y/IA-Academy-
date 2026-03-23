import type { ToolLevel, ToolPlan } from "@/lib/types/tool";

export const PLAN_OPTIONS: Array<{ value: ToolPlan; label: string }> = [
  { value: "free", label: "Gratis" },
  { value: "edu_free", label: "Beneficio estudiantil" },
  { value: "freemium", label: "Freemium" },
  { value: "paid", label: "Pago" },
];

export const LEVEL_OPTIONS: Array<{ value: ToolLevel; label: string }> = [
  { value: "beginner", label: "Principiante" },
  { value: "intermediate", label: "Intermedio" },
  { value: "advanced", label: "Avanzado" },
  { value: "all", label: "Universal" },
];

export const PAGE_SIZE = 50;
export const SEARCH_DEBOUNCE_MS = 250;
export const CACHE_TTL_MS = 90_000;

export const CAREER_TOOL_SELECT = [
  "id, name, slug, description, url, cover_image_url, plan, level, ia_type, verified, edu_verified, featured, sort_order, created_at",
  "tool_careers(sort_order, career_paths(id, name, slug, description, color_accent, icon_name, sort_order))",
].join(", ");
