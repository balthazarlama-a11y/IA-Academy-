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
  const careerHighlights = careerOptions
    .filter((career) => career.slug !== "general")
    .slice(0, 3)
    .map((career) => ({
      label: career.name,
      value: career.description ?? "Curadoria viva para tu contexto profesional.",
    }));

  return (
    <main className="relative min-h-screen flex flex-col">
      <Header />

      <section className="flex-1 w-full px-5 py-8 md:px-6 md:py-12 xl:px-8">
        <div className="editorial-frame flex flex-col gap-6">
          <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_36px_rgba(15,23,42,0.05)]">
            <div className="grid gap-5 p-5 md:p-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:p-7">
              <div>
                <p className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-slate-600">
                  Carreras
                </p>
                <h1 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight text-slate-950 md:text-4xl lg:text-[3.25rem] lg:leading-[0.98]">
                  Elige tu carrera y descubre las IAs que si te sirven.
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 md:text-[15px]">
                  Navega por carreras reales del catalogo y combina profesion, plan y nivel
                  para llegar mas rapido a las herramientas que si encajan contigo.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {careerHighlights.map((item) => (
                    <span
                      key={item.label}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-600"
                    >
                      <span className="font-semibold text-slate-900">{item.label}</span>
                      <span className="hidden sm:inline">{item.value}</span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Carrera</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">Profesiones y contextos</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">
                    Elige una o varias disciplinas para refinar la lectura.
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Plan</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">Gratis, edu o pago</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">
                    Filtra segun acceso y costo antes de abrir la ficha.
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Nivel</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">De simple a avanzado</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">
                    Alinea la herramienta con tu experiencia y el objetivo que buscas.
                  </p>
                </div>
              </div>
            </div>
          </div>

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
