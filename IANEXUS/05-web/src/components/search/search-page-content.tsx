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
    <div className="editorial-frame flex flex-col gap-4 md:gap-5">
      <section className="overflow-hidden rounded-[1.5rem] ui-shell">
        <div className="border-b ui-rule px-4 py-4 md:px-6 md:py-5">
          <p className="ui-label">Buscar</p>
          <div className="mt-2 max-w-3xl space-y-2">
            <h1 className="ui-title text-[2.05rem] leading-[0.98] text-slate-950 md:text-[3.35rem]">Encuentra la herramienta que necesitas</h1>
            <p className="text-[13px] leading-relaxed text-slate-600 md:text-base">Empieza por la necesidad. Luego acota por área y caso de uso, sin mezclar taxonomías confusas.</p>
          </div>
        </div>

        <form action="/buscar" className="space-y-3.5 px-4 py-4 md:space-y-4 md:px-6 md:py-5">
          <label className="block">
            <span className="sr-only">Buscar herramientas</span>
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input type="search" name="q" defaultValue={data.filters.q} placeholder="Ej: resumir PDFs, estudiar derecho, hacer presentaciones" className="ui-input h-12 w-full rounded-[1rem] pl-11 pr-4 text-[14px] outline-none transition md:h-14 md:text-[15px]" />
            </div>
          </label>

          <div className="rounded-[1rem] border ui-rule bg-[rgba(250,249,247,0.92)] p-3 md:p-4">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.9fr)_minmax(0,0.9fr)_minmax(0,0.9fr)_auto]">
              <label className="flex flex-col gap-1.5">
                <span className="ui-label">Área</span>
                <select name="area" defaultValue={data.filters.area} className="ui-select h-11 rounded-[0.9rem] px-3 text-sm outline-none transition">
                  <option value="">Todas las áreas</option>
                  {data.areas.map((area) => <option key={area.id} value={area.slug}>{area.name}</option>)}
                </select>
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="ui-label">Caso de uso</span>
                <select name="useCase" defaultValue={data.filters.useCase} className="ui-select h-11 rounded-[0.9rem] px-3 text-sm outline-none transition">
                  <option value="">Todos los casos</option>
                  {data.useCases.map((useCase) => <option key={useCase.id} value={useCase.slug}>{useCase.name}</option>)}
                </select>
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="ui-label">Plan</span>
                <select name="plan" defaultValue={data.filters.plan} className="ui-select h-11 rounded-[0.9rem] px-3 text-sm outline-none transition">
                  {PLAN_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="ui-label">Tipo de IA</span>
                <select name="iaType" defaultValue={data.filters.iaType} className="ui-select h-11 rounded-[0.9rem] px-3 text-sm outline-none transition">
                  <option value="">Todos los tipos</option>
                  {data.iaTypes.map((iaType) => <option key={iaType} value={iaType}>{iaType}</option>)}
                </select>
              </label>

              <div className="flex flex-col-reverse md:flex-row items-stretch md:items-end gap-2 xl:justify-end">
                {hasFilters ? <Link href="/buscar" className="inline-flex h-11 w-full md:w-auto items-center justify-center rounded-[0.9rem] border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50">Limpiar</Link> : null}
                <button type="submit" className="inline-flex h-11 w-full md:w-auto items-center justify-center rounded-[0.9rem] bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800">Buscar</button>
              </div>
            </div>
          </div>
        </form>
      </section>

      <section className="rounded-[1.2rem] ui-panel p-3.5 md:rounded-[1.35rem] md:p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="ui-label">Resultados</p>
            <h2 className="mt-1 text-[1.5rem] font-semibold tracking-tight text-slate-950 md:text-[2rem]">Mostrando {data.resultCount} herramientas</h2>
          </div>
          <p className="max-w-md text-[13px] text-slate-500 md:text-sm">{hasFilters ? "Resultados filtrados y ordenados por relevancia para tu búsqueda actual." : "Filtra por área, plan o caso de uso cuando ya sabes mejor lo que necesitas."}</p>
        </div>

        {activeFilters.length > 0 ? <div className="mt-3 flex flex-wrap gap-2 md:mt-4">{activeFilters.map((filter) => <span key={filter} className="ui-chip inline-flex items-center rounded-full px-2.5 py-1.5 text-[11px] md:px-3 md:text-xs">{filter}</span>)}<Link href="/buscar" className="inline-flex items-center rounded-full border border-slate-300 bg-white px-2.5 py-1.5 text-[11px] font-medium text-slate-600 transition hover:border-slate-400 hover:bg-slate-50 md:px-3 md:text-xs">Limpiar filtros</Link></div> : null}

        <div className="mt-4 md:mt-5">
          {data.tools.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{data.tools.map((tool) => <SearchToolCard key={tool.id} tool={tool} />)}</div>
          ) : (
            <div className="ui-empty rounded-[1.2rem] px-6 py-10 text-center">
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
