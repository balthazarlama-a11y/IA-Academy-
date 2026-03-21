import { Search } from "lucide-react";

interface AreasEmptyStateProps {
  hasFilters: boolean;
  onReset?: () => void;
}

export default function AreasEmptyState({ hasFilters, onReset }: AreasEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
      <Search className="mb-4 h-11 w-11 text-slate-300" />
      <h3 className="text-lg font-semibold text-slate-900">
        {hasFilters ? "Sin resultados con esta combinacion" : "Sin herramientas todavia"}
      </h3>
      <p className="mt-2 max-w-sm text-sm text-slate-500">
        {hasFilters
          ? "Quita un filtro o amplia una carrera para descubrir mas herramientas."
          : "Las herramientas por carrera apareceran aqui a medida que sumemos nuevas curadurias."}
      </p>
      {hasFilters && onReset ? (
        <button
          type="button"
          onClick={onReset}
          className="mt-5 inline-flex items-center rounded-full border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
        >
          Limpiar filtros
        </button>
      ) : null}
    </div>
  );
}
