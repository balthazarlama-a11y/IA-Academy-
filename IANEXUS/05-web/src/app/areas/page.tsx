import type { Metadata } from "next";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import AreasToolbar from "@/components/areas/areas-toolbar";
import {
  CAREER_TOOL_SELECT,
  LEVEL_OPTIONS,
  PAGE_SIZE,
  PLAN_OPTIONS,
  getCareerPaths,
  mapCareerOption,
  mapTool,
  normalizeCareerSlugs,
  normalizeLevels,
  normalizePlans,
  sanitizeSearch,
  type CareerOption,
  type LocalFilters,
  type RawCareerPathRow,
  type RawToolRow,
} from "@/components/areas/areas-data";
import { CommunityCtaBanner } from "@/components/marketing/community-cta-banner";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Tool } from "@/lib/types/tool";

// No static revalidation — page is dynamic when searchParams are present.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Carreras | IA NEXUS",
  description:
    "Explora herramientas de IA por carrera y encuentra opciones utiles segun contexto profesional, acceso y nivel.",
};

const VALID_PLANS = new Set<string>(PLAN_OPTIONS.map((option) => option.value));
const VALID_LEVELS = new Set<string>(LEVEL_OPTIONS.map((option) => option.value));

function parseFilters(
  raw: Record<string, string | string[] | undefined>,
  validCareerSlugs: Set<string>,
): LocalFilters {
  const search = typeof raw.q === "string" ? raw.q : undefined;
  const readList = (key: string) => {
    const value = raw[key];
    const entries = Array.isArray(value) ? value : value ? [value] : [];
    return [...new Set(entries.flatMap((entry) => entry.split(",")).map((entry) => entry.trim()).filter(Boolean))];
  };

  const rawAreas = readList("area");
  const rawPlans = readList("plan");
  const rawLevels = readList("level");

  return {
    search: search?.trim() || "",
    careerSlugs: normalizeCareerSlugs(rawAreas, validCareerSlugs),
    plans: normalizePlans(rawPlans.filter((value) => VALID_PLANS.has(value))),
    levels: normalizeLevels(rawLevels.filter((value) => VALID_LEVELS.has(value))),
  };
}

async function fetchCareerOptions() {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase
    .from("career_paths")
    .select("id, name, slug, description, color_accent, icon_name, sort_order")
    .eq("status", "published")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  return ((data ?? []) as RawCareerPathRow[]).map(mapCareerOption);
}

async function fetchAreasPage(
  filters: LocalFilters,
  careerOptions: CareerOption[],
): Promise<{ tools: Tool[]; hasMore: boolean; nextOffset: number | null }> {
  const supabase = getSupabaseServerClient();
  const careerIdMap = new Map(careerOptions.map((career) => [career.slug, career.id]));

  let toolIds: string[] | null = null;
  if (filters.careerSlugs.length > 0) {
    const selectedCareerIds = filters.careerSlugs
      .map((slug) => careerIdMap.get(slug))
      .filter((value): value is string => Boolean(value));

    if (selectedCareerIds.length === 0) {
      return { tools: [], hasMore: false, nextOffset: null };
    }

    const { data: relationRows, error: relationError } = await supabase
      .from("tool_careers")
      .select("tool_id")
      .in("career_path_id", selectedCareerIds);

    if (relationError) {
      console.error("[areas/page] fetch relation rows:", relationError.message);
      return { tools: [], hasMore: false, nextOffset: null };
    }

    toolIds = [...new Set((relationRows ?? []).map((row) => row.tool_id).filter(Boolean))];
    if (toolIds.length === 0) {
      return { tools: [], hasMore: false, nextOffset: null };
    }
  }

  let query = supabase
    .from("tools")
    .select(CAREER_TOOL_SELECT)
    .eq("status", "published")
    .order("featured", { ascending: false })
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (toolIds) query = query.in("id", toolIds);
  if (filters.plans.length > 0) query = query.in("plan", filters.plans);
  if (filters.levels.length > 0) query = query.in("level", filters.levels);

  const safeSearch = sanitizeSearch(filters.search);
  if (safeSearch.length > 0) {
    query = query.or(
      `name.ilike.%${safeSearch}%,description.ilike.%${safeSearch}%,ia_type.ilike.%${safeSearch}%`,
    );
  }

  const { data, error } = await query.range(0, PAGE_SIZE - 1);
  if (error) {
    console.error("[areas/page] fetch tools:", error.message);
    return { tools: [], hasMore: false, nextOffset: null };
  }

  const tools = ((data ?? []) as unknown as RawToolRow[]).map((row) => {
    const mapped = mapTool(row);
    const careers = getCareerPaths(row.tool_careers);
    if (filters.careerSlugs.length > 0) {
      const matchedCareer = careers.find((career) => filters.careerSlugs.includes(career.slug));
      if (matchedCareer) {
        return { ...mapped, category: { ...mapped.category, ...matchedCareer } };
      }
    }
    return mapped;
  });

  return {
    tools,
    hasMore: tools.length === PAGE_SIZE,
    nextOffset: tools.length === PAGE_SIZE ? PAGE_SIZE : null,
  };
}

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AreasPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const careerOptions = await fetchCareerOptions();
  const validCareerSlugs = new Set(careerOptions.map((career) => career.slug));
  const initialFilters = parseFilters(params, validCareerSlugs);
  const initialPage = await fetchAreasPage(initialFilters, careerOptions);

  return (
    <main className="relative flex min-h-screen flex-col bg-[linear-gradient(180deg,#f8f3ea_0%,#fbf8f3_40%,#ffffff_100%)]">
      <Header />

      <section className="flex-1 w-full px-5 py-8 md:px-6 md:py-10 xl:px-8">
        <div className="editorial-frame flex flex-col gap-6">
          <AreasToolbar
            initialTools={initialPage.tools}
            initialHasMore={initialPage.hasMore}
            initialNextOffset={initialPage.nextOffset}
            initialFilters={initialFilters}
            careerOptions={careerOptions}
          />

          <div className="w-full max-w-3xl">
            <CommunityCtaBanner location="areas_banner" />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
