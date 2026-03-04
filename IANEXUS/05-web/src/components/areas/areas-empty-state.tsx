import { Search } from "lucide-react";

interface AreasEmptyStateProps {
  hasFilters: boolean;
}

export default function AreasEmptyState({ hasFilters }: AreasEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <Search className="h-12 w-12 text-white/20 mb-4" />
      <h3 className="text-lg font-semibold text-white/60">
        {hasFilters ? "Sin resultados" : "Sin herramientas aún"}
      </h3>
      <p className="text-sm text-white/40 mt-2 max-w-sm">
        {hasFilters
          ? "Prueba con otros filtros o limpia la búsqueda."
          : "Las herramientas por área aparecerán aquí pronto."}
      </p>
    </div>
  );
}
