import Link from "next/link";

export default function StudentsEmptyState({
  hasActiveFilters,
  resetHref,
}: {
  hasActiveFilters: boolean;
  resetHref: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center shadow-[0_12px_32px_rgba(15,23,42,0.05)] md:px-10">
      <div className="mx-auto inline-flex items-center rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-xs uppercase tracking-[0.12em] text-slate-600">
        Curaduría académica
      </div>

      <h2 className="mt-5 text-2xl font-semibold text-slate-900">
        No encontramos oportunidades con esos filtros
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-600 md:text-base">
        Prueba ampliando la búsqueda, quitando el filtro de acceso o incluyendo freemium para
        descubrir más opciones útiles.
      </p>

      <div className="mt-7 flex justify-center">
        {hasActiveFilters ? (
          <Link
            href={resetHref}
            className="inline-flex items-center rounded-full border border-cyan-300/40 bg-cyan-400/10 px-5 py-2.5 text-sm font-medium text-cyan-700 transition hover:bg-cyan-400/20"
          >
            Limpiar filtros
          </Link>
        ) : (
          <Link
            href="/estudiantes"
            className="inline-flex items-center rounded-full border border-slate-300 bg-slate-50 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Volver al catálogo
          </Link>
        )}
      </div>
    </div>
  );
}

