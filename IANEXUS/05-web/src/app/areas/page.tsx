import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import AreasToolbar from "@/components/areas/areas-toolbar";
import { CommunityCtaBanner } from "@/components/marketing/community-cta-banner";
import { getAreasPage } from "@/lib/repositories/areas-repo";
import type { AreaFilters } from "@/lib/repositories/areas-repo";
import type { ToolLevel, ToolPlan } from "@/lib/types/tool";

// No static revalidation — page is dynamic when searchParams are present.
export const dynamic = "force-dynamic";

const VALID_PLANS  = new Set<string>(["free", "freemium", "paid", "edu_free"]);
const VALID_LEVELS = new Set<string>(["beginner", "intermediate", "advanced", "all"]);
const VALID_AREAS  = new Set<string>(["programacion", "salud", "investigacion", "diseno", "escritura"]);

function parseFilters(raw: Record<string, string | string[] | undefined>): AreaFilters {
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
    search: search?.trim() || undefined,
    categorySlugs: rawAreas.filter((value) => VALID_AREAS.has(value)),
    plans: rawPlans.filter((value) => VALID_PLANS.has(value)) as ToolPlan[],
    levels: rawLevels.filter((value) => VALID_LEVELS.has(value)) as ToolLevel[],
  };
}

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AreasPage({ searchParams }: PageProps) {
  const params         = await searchParams;
  const initialFilters = parseFilters(params);
  const initialPage    = await getAreasPage(initialFilters, { limit: 50, offset: 0 });

  return (
    <main className="relative min-h-screen flex flex-col">
      <Header />

      <section className="flex-1 w-full px-6 py-10 md:py-14">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-10">
          <div className="w-full overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.06)]">
            <div className="grid gap-8 p-6 md:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:p-10">
              <div>
                <p className="inline-flex items-center rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-xs uppercase tracking-[0.16em] text-slate-600">
                  Areas
                </p>
                <h1
                  className="mt-4 text-4xl font-semibold leading-tight text-slate-900 md:text-5xl lg:text-6xl"
                >
                  IA por especialidad, no por ruido
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 md:text-lg">
                  Cruza area, plan y nivel para encontrar herramientas utiles en programacion,
                  salud, investigacion, diseno o escritura.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Area</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">Especialidad real</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">
                    Elige una o varias disciplinas para refinar la lectura.
                  </p>
                </div>
                <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Plan</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">Gratis, edu o pago</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">
                    Filtra segun acceso y costo antes de abrir la ficha.
                  </p>
                </div>
                <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Nivel</p>
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
