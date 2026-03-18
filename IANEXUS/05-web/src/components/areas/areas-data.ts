import type { Tool, ToolCategory, ToolLevel, ToolPlan } from "@/lib/types/tool";

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

type RawCareerRelation = {
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

export const PLAN_OPTIONS: Array<{ value: ToolPlan; label: string }> = [
  { value: "free", label: "Gratis" },
  { value: "edu_free", label: ".edu Gratis" },
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

export function mapCareerOption(row: RawCareerPathRow): CareerOption {
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

export function sanitizeSearch(value: string) {
  return value.trim().replaceAll(",", " ");
}

export function normalizeArray(values: string[]) {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

export function normalizeCareerSlugs(values: string[] | undefined, validSlugs: Set<string>): string[] {
  return normalizeArray(values ?? []).filter((value) => validSlugs.has(value));
}

export function normalizePlans(values: string[] | undefined): ToolPlan[] {
  const valid = new Set<ToolPlan>(PLAN_OPTIONS.map((option) => option.value));
  return normalizeArray(values ?? []).filter((value) => valid.has(value as ToolPlan)) as ToolPlan[];
}

export function normalizeLevels(values: string[] | undefined): ToolLevel[] {
  const valid = new Set<ToolLevel>(LEVEL_OPTIONS.map((option) => option.value));
  return normalizeArray(values ?? []).filter((value) => valid.has(value as ToolLevel)) as ToolLevel[];
}

export function mergeUniqueById(previous: Tool[], incoming: Tool[]): Tool[] {
  const seen = new Set(previous.map((tool) => tool.id));
  const merged = [...previous];

  for (const tool of incoming) {
    if (!seen.has(tool.id)) {
      seen.add(tool.id);
      merged.push(tool);
    }
  }

  return merged;
}

export function toggleItem<T extends string>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

export function buildKey(filters: LocalFilters, offset: number): string {
  return JSON.stringify({
    search: sanitizeSearch(filters.search).toLowerCase(),
    careerSlugs: [...filters.careerSlugs].sort(),
    plans: [...filters.plans].sort(),
    levels: [...filters.levels].sort(),
    offset,
    limit: PAGE_SIZE,
  });
}

export function hasActiveFilters(filters: LocalFilters): boolean {
  return (
    filters.search.trim().length > 0 ||
    filters.careerSlugs.length > 0 ||
    filters.plans.length > 0 ||
    filters.levels.length > 0
  );
}

export function buildCareerIdMap(careerOptions: CareerOption[]) {
  return new Map(careerOptions.map((career) => [career.slug, career.id]));
}

export function getCareerPaths(relations: RawCareerRelation[] | null | undefined): CareerOption[] {
  return (relations ?? [])
    .map((entry) => {
      const value = Array.isArray(entry.career_paths) ? entry.career_paths[0] : entry.career_paths;
      return value ? { ...mapCareerOption(value), sort_order: entry.sort_order ?? value.sort_order } : null;
    })
    .filter((career): career is CareerOption => Boolean(career))
    .sort((left, right) => left.sort_order - right.sort_order || left.name.localeCompare(right.name));
}

function mapCareerToCategory(career: CareerOption | null): ToolCategory {
  if (!career) {
    return {
      id: "",
      name: "General",
      slug: "general",
      description: "Curada para esta carrera y pensada para uso practico.",
      color_accent: "#475569",
      icon_name: null,
      sort_order: 0,
    };
  }

  return {
    id: career.id,
    name: career.name,
    slug: career.slug,
    description: career.description,
    color_accent: career.color_accent,
    icon_name: career.icon_name,
    sort_order: career.sort_order,
  };
}

export function mapTool(row: RawToolRow): Tool {
  const careers = getCareerPaths(row.tool_careers);
  const primaryCareer = careers[0] ?? null;

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    url: row.url,
    cover_image_url: row.cover_image_url,
    plan: row.plan,
    level: row.level,
    ia_type: row.ia_type,
    verified: row.verified,
    edu_verified: row.edu_verified,
    featured: row.featured,
    sort_order: row.sort_order ?? 0,
    careers,
    primaryCareer: primaryCareer ?? undefined,
    created_at: row.created_at ?? "",
    category: mapCareerToCategory(primaryCareer),
    guide_slug: null,
  };
}
