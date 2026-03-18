import { Search } from "lucide-react";

interface AreasEmptyStateProps {
  hasFilters: boolean;
}

export default function AreasEmptyState({ hasFilters }: AreasEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
      <Search className="mb-4 h-11 w-11 text-slate-300" />
      <h3 className="text-lg font-semibold text-slate-900">
        {hasFilters ? "Sin resultados con esta combinacion" : "Sin herramientas todavia"}
      </h3>
      <p className="mt-2 max-w-sm text-sm text-slate-500">
        {hasFilters
          ? "Quita un filtro o amplía una carrera para descubrir mas herramientas."
          : "Las herramientas por carrera apareceran aqui a medida que sumemos nuevas curadurias."}
      </p>
    </div>
  );
}

