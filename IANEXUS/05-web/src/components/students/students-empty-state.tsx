import Link from "next/link";
import { Search } from "lucide-react";

export default function StudentsEmptyState({
  hasActiveFilters,
  resetHref,
}: {
  hasActiveFilters: boolean;
  resetHref: string;
}) {
  return (
    <div className="ui-empty flex flex-col items-center justify-center rounded-[1.15rem] px-6 py-14 text-center">
      <Search className="mb-4 h-11 w-11 text-slate-300" />
      <p className="ui-label">Curaduría académica</p>
      <h2 className="mt-2 text-lg font-semibold text-slate-900">
        {hasActiveFilters
          ? "No encontramos herramientas con esta combinación"
          : "Todavía no hay herramientas visibles"}
      </h2>
      <p className="mt-2 max-w-md text-sm text-slate-500">
        {hasActiveFilters
          ? "Amplía el acceso, quita el tipo de IA o incluye freemium para ver más opciones útiles."
          : "Las herramientas para estudiantes aparecerán aquí a medida que publiquemos nuevas curadurías."}
      </p>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        {hasActiveFilters ? (
          <Link
            href={resetHref}
            className="inline-flex items-center rounded-full border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Limpiar filtros
          </Link>
        ) : (
          <Link
            href="/estudiantes"
            className="inline-flex items-center rounded-full border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Volver al catálogo
          </Link>
        )}
      </div>
    </div>
  );
}
