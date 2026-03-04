import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import AreasToolbar from "@/components/areas/areas-toolbar";
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
        <div className="mx-auto w-full max-w-7xl flex flex-col items-center gap-10">

          {/* Hero */}
          <div className="w-full text-center">
            <p className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.14em] text-white/65">
              Áreas
            </p>
            <h1
              className="mt-4 text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight"
              style={{
                backgroundImage: "linear-gradient(to right, #8b5cf6, #ec4899)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Herramientas por área
            </h1>
            <p className="mt-4 text-lg md:text-xl text-white/60 max-w-2xl mx-auto">
              Filtra por especialidad y encuentra las IAs más útiles para tu campo.
            </p>
          </div>

          {/* Toolbar + Grid (client-side) */}
          <AreasToolbar
            initialTools={initialPage.tools}
            initialHasMore={initialPage.hasMore}
            initialNextOffset={initialPage.nextOffset}
            initialFilters={initialFilters}
          />

        </div>
      </section>

      <Footer />
    </main>
  );
}

