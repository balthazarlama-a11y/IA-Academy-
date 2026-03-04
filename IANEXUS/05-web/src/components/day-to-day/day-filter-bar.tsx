"use client";

import { useState, useCallback } from "react";

type FilterState = {
  search: string;
  plan: "all" | "free" | "edu_free" | "freemium";
  category: string;
  level: "all" | "beginner" | "intermediate" | "advanced";
};

type DayFilterBarProps = {
  onFilterChange: (filters: FilterState) => void;
  categories: string[];
};

const PLAN_OPTIONS = [
  { value: "all", label: "Todos los planes" },
  { value: "free", label: "Gratis" },
  { value: "edu_free", label: "Edu Free" },
  { value: "freemium", label: "Freemium" },
] as const;

const LEVEL_OPTIONS = [
  { value: "all", label: "Todos los niveles" },
  { value: "beginner", label: "Principiante" },
  { value: "intermediate", label: "Intermedio" },
  { value: "advanced", label: "Avanzado" },
] as const;

export default function DayFilterBar({ onFilterChange, categories }: DayFilterBarProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    plan: "all",
    category: "",
    level: "all",
  });

  const updateFilter = useCallback(
    <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
      const newFilters = { ...filters, [key]: value };
      setFilters(newFilters);
      onFilterChange(newFilters);
    },
    [filters, onFilterChange]
  );

  const hasActiveFilters =
    filters.search ||
    filters.plan !== "all" ||
    filters.category ||
    filters.level !== "all";

  const clearFilters = useCallback(() => {
    const reset: FilterState = {
      search: "",
      plan: "all",
      category: "",
      level: "all",
    };
    setFilters(reset);
    onFilterChange(reset);
  }, [onFilterChange]);

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-white/[0.04] p-4 md:p-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
        {/* Search */}
        <div className="md:col-span-4">
          <label className="mb-1.5 block text-xs uppercase tracking-[0.12em] text-white/50">
            Buscar
          </label>
          <input
            type="text"
            placeholder="Nombre, tipo de IA..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-cyan-300/50"
          />
        </div>

        {/* Plan */}
        <div className="md:col-span-3">
          <label className="mb-1.5 block text-xs uppercase tracking-[0.12em] text-white/50">
            Plan
          </label>
          <select
            value={filters.plan}
            onChange={(e) => updateFilter("plan", e.target.value as FilterState["plan"])}
            className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none transition focus:border-cyan-300/50"
          >
            {PLAN_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#0f0f16]">
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Category */}
        <div className="md:col-span-3">
          <label className="mb-1.5 block text-xs uppercase tracking-[0.12em] text-white/50">
            Categoría
          </label>
          <select
            value={filters.category}
            onChange={(e) => updateFilter("category", e.target.value)}
            className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none transition focus:border-cyan-300/50"
          >
            <option value="" className="bg-[#0f0f16]">
              Todas
            </option>
            {categories.map((cat) => (
              <option key={cat} value={cat} className="bg-[#0f0f16]">
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Level */}
        <div className="md:col-span-2">
          <label className="mb-1.5 block text-xs uppercase tracking-[0.12em] text-white/50">
            Nivel
          </label>
          <select
            value={filters.level}
            onChange={(e) => updateFilter("level", e.target.value as FilterState["level"])}
            className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none transition focus:border-cyan-300/50"
          >
            {LEVEL_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#0f0f16]">
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Clear filters */}
      {hasActiveFilters && (
        <div className="mt-4 flex justify-end border-t border-white/10 pt-3">
          <button
            onClick={clearFilters}
            className="text-xs text-white/50 hover:text-white/80 transition-colors"
          >
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
}

export type { FilterState };
