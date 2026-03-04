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
            className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-medium text-white/85 transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoadingMore ? "Cargando..." : "Cargar 50 más"}
          </button>
        </div>
      ) : null}
    </>
  );
}

export default memo(AreaToolsGrid);
