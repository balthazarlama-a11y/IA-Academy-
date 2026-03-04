import { memo } from "react";
import type { Tool } from "@/lib/types/tool";
import AreaToolCard from "./area-tool-card";

type AreaToolsGridProps = {
  tools: Tool[];
  isLoading: boolean;
  hasMore: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
};

function AreaToolsGrid({
  tools,
  isLoading,
  hasMore,
  isLoadingMore,
  onLoadMore,
}: AreaToolsGridProps) {
  return (
    <>
      <div
        className={`grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 transition-opacity duration-150 ${
          isLoading ? "pointer-events-none opacity-50" : "opacity-100"
        }`}
      >
        {tools.map((tool) => (
          <AreaToolCard key={tool.id} tool={tool} />
        ))}
      </div>

      {hasMore ? (
        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="inline-flex items-center rounded-full border border-slate-300 bg-slate-50 px-5 py-2.5 text-sm font-medium text-slate-800 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoadingMore ? "Cargando..." : "Cargar 50 más"}
          </button>
        </div>
      ) : null}
    </>
  );
}

export default memo(AreaToolsGrid);

