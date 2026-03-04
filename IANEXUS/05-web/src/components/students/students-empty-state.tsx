import Link from "next/link";

export default function StudentsEmptyState({
  hasActiveFilters,
  resetHref,
}: {
  hasActiveFilters: boolean;
  resetHref: string;
}) {
  return (
    <div className="rounded-3xl border border-white/15 bg-white/[0.06] px-6 py-14 text-center backdrop-blur-2xl md:px-10">
      <div className="mx-auto inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.12em] text-white/60">
        Catalogo estudiantes
      </div>

      <h2 className="mt-5 text-2xl font-semibold text-white">
        No encontramos oportunidades con esos filtros
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/60 md:text-base">
        Prueba ampliando la busqueda o activa la opcion de freemium para descubrir mas
        herramientas para tu carrera.
      </p>

      <div className="mt-7 flex justify-center">
        {hasActiveFilters ? (
          <Link
            href={resetHref}
            className="inline-flex items-center rounded-full border border-cyan-300/40 bg-cyan-400/10 px-5 py-2.5 text-sm font-medium text-cyan-100 transition hover:bg-cyan-400/20"
          >
            Limpiar filtros
          </Link>
        ) : (
          <Link
            href="/areas"
            className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-medium text-white/80 transition hover:bg-white/15"
          >
            Explorar por areas
          </Link>
        )}
      </div>
    </div>
  );
}
