import Link from "next/link";
import { Search } from "lucide-react";
import type { SearchPageData } from "@/lib/repositories/search-repo";
import SearchToolCard from "@/components/search/search-tool-card";

const PLAN_OPTIONS = [
  { value: "", label: "Todos los planes" },
  { value: "free", label: "Gratis" },
  { value: "edu_free", label: "Beneficio estudiantil" },
  { value: "freemium", label: "Freemium" },
  { value: "paid", label: "Pago" },
] as const;

function getPlanLabel(value: SearchPageData["filters"]["plan"]) {
  return PLAN_OPTIONS.find((option) => option.value === value)?.label ?? "Todos los planes";
}

export default function SearchPageContent({ data }: { data: SearchPageData }) {
  const hasFilters = Boolean(data.filters.q || data.filters.area || data.filters.useCase || data.filters.plan || data.filters.iaType);

  const activeFilters = [
    data.filters.q ? `Búsqueda: “${data.filters.q}”` : null,
    data.filters.area ? `Área: ${data.areas.find((item) => item.slug === data.filters.area)?.name ?? data.filters.area}` : null,
    data.filters.useCase ? `Caso de uso: ${data.useCases.find((item) => item.slug === data.filters.useCase)?.name ?? data.filters.useCase}` : null,
    data.filters.plan ? `Plan: ${getPlanLabel(data.filters.plan)}` : null,
    data.filters.iaType ? `Tipo: ${data.filters.iaType}` : null,
  ].filter(Boolean) as string[];

  return (
    <div className="editorial-frame flex flex-col gap-5">
      <section className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white/95 shadow-[0_16px_44px_rgba(15,23,42,0.05)]">
        <div className="border-b border-slate-100 px-5 py-5 md:px-6">
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Buscar</p>
          <div className="mt-2 max-w-3xl space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">Encuentra la herramienta que necesitas</h1>
            <p className="text-sm leading-relaxed text-slate-600 md:text-base">Empieza por la necesidad. Luego acota por área y caso de uso, sin mezclar taxonomías confusas.</p>
          </div>
        </div>

        <form action="/buscar" className="space-y-4 px-5 py-5 md:px-6">
          <label className="block">
            <span className="sr-only">Buscar herramientas</span>
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input type="search" name="q" defaultValue={data.filters.q} placeholder="Ej.: resumir PDFs, estudiar derecho, hacer presentaciones" className="h-14 w-full rounded-2xl border border-slate-300 bg-white pl-11 pr-4 text-[15px] text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200" />
            </div>
          </label>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 md:p-4">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.9fr)_minmax(0,0.9fr)_minmax(0,0.9fr)_auto]">
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">Área</span>
                <select name="area" defaultValue={data.filters.area} className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400">
                  <option value="">Todas las áreas</option>
                  {data.areas.map((area) => <option key={area.id} value={area.slug}>{area.name}</option>)}
                </select>
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">Caso de uso</span>
                <select name="useCase" defaultValue={data.filters.useCase} className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400">
                  <option value="">Todos los casos</option>
                  {data.useCases.map((useCase) => <option key={useCase.id} value={useCase.slug}>{useCase.name}</option>)}
                </select>
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">Plan</span>
                <select name="plan" defaultValue={data.filters.plan} className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400">
                  {PLAN_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">Tipo de IA</span>
                <select name="iaType" defaultValue={data.filters.iaType} className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400">
                  <option value="">Todos los tipos</option>
                  {data.iaTypes.map((iaType) => <option key={iaType} value={iaType}>{iaType}</option>)}
                </select>
              </label>

              <div className="flex items-end gap-2 xl:justify-end">
                <button type="submit" className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800">Buscar</button>
                {hasFilters ? <Link href="/buscar" className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50">Limpiar</Link> : null}
              </div>
            </div>
          </div>
        </form>
      </section>

      <section className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-[0_14px_36px_rgba(15,23,42,0.04)] md:p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Resultados</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">Mostrando {data.resultCount} herramientas</h2>
          </div>
          <p className="max-w-md text-sm text-slate-500">{hasFilters ? "Resultados filtrados y ordenados por relevancia para tu búsqueda actual." : "Filtra por área, plan o caso de uso cuando ya sabes mejor lo que necesitas."}</p>
        </div>

        {activeFilters.length > 0 ? <div className="mt-4 flex flex-wrap gap-2">{activeFilters.map((filter) => <span key={filter} className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700">{filter}</span>)}<Link href="/buscar" className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50">Limpiar filtros</Link></div> : null}

        <div className="mt-5">
          {data.tools.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{data.tools.map((tool) => <SearchToolCard key={tool.id} tool={tool} />)}</div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
              <p className="text-base font-medium text-slate-900">No encontramos herramientas con ese cruce.</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">Prueba otra área, cambia el plan o busca por una necesidad más amplia.</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <Link href="/areas" className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100">Explorar áreas</Link>
                <Link href="/estudiantes" className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100">Ver beneficios estudiantiles</Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
