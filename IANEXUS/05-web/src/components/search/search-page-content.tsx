import Link from "next/link";
import type { SearchPageData } from "@/lib/repositories/search-repo";
import SearchToolCard from "@/components/search/search-tool-card";

const PLAN_OPTIONS = [
  { value: "", label: "Todos los planes" },
  { value: "free", label: "Gratis" },
  { value: "edu_free", label: "Beneficio estudiantil" },
  { value: "freemium", label: "Freemium" },
  { value: "paid", label: "Pago" },
] as const;

export default function SearchPageContent({ data }: { data: SearchPageData }) {
  const hasFilters = Boolean(
    data.filters.q || data.filters.career || data.filters.plan || data.filters.iaType,
  );

  return (
    <div className="editorial-frame flex flex-col gap-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_16px_44px_rgba(15,23,42,0.05)] md:p-6">
        <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
          Discovery search
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
          Busca herramientas sin entrar primero por carrera
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 md:text-base">
          Cruza nombre, carrera, plan y tipo de IA para encontrar opciones útiles más rápido.
        </p>

        <form action="/buscar" className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,0.8fr))]">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-slate-600">Buscar</span>
            <input
              type="search"
              name="q"
              defaultValue={data.filters.q}
              placeholder="Nombre, descripción o tipo de IA"
              className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-slate-600">Carrera</span>
            <select
              name="career"
              defaultValue={data.filters.career}
              className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
            >
              <option value="">Todas las carreras</option>
              {data.careers.map((career) => (
                <option key={career.id} value={career.slug}>
                  {career.name}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-slate-600">Plan</span>
            <select
              name="plan"
              defaultValue={data.filters.plan}
              className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
            >
              {PLAN_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-slate-600">Tipo de IA</span>
            <select
              name="iaType"
              defaultValue={data.filters.iaType}
              className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
            >
              <option value="">Todos los tipos</option>
              {data.iaTypes.map((iaType) => (
                <option key={iaType} value={iaType}>
                  {iaType}
                </option>
              ))}
            </select>
          </label>

          <div className="flex items-end gap-2 xl:col-span-4">
            <button
              type="submit"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Buscar
            </button>
            {hasFilters ? (
              <Link
                href="/buscar"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Limpiar
              </Link>
            ) : null}
          </div>
        </form>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_14px_36px_rgba(15,23,42,0.04)] md:p-5">
        <div className="mb-4 flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Resultados</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
              {data.resultCount} herramientas encontradas
            </h2>
          </div>
          <p className="text-sm text-slate-500">
            {hasFilters
              ? "Resultados filtrados por tu búsqueda actual."
              : "Explora todo el catálogo con una capa de discovery más directa."}
          </p>
        </div>

        {data.tools.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {data.tools.map((tool) => (
              <SearchToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
            <p className="text-base font-medium text-slate-900">
              No encontramos herramientas con ese cruce.
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Prueba otra carrera, cambia el plan o busca por una necesidad más amplia.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <Link
                href="/areas"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Explorar carreras
              </Link>
              <Link
                href="/estudiantes"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Ver beneficios estudiantiles
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
