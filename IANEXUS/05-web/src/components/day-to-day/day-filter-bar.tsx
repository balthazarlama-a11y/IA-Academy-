"use client";

import { useState, useCallback } from "react";

type FilterState = {
  search: string;
  plan: "all" | "free" | "edu_free" | "freemium" | "paid";
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
  { value: "edu_free", label: "Beneficio estudiantil" },
  { value: "freemium", label: "Freemium" },
  { value: "paid", label: "Pago" },
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
    [filters, onFilterChange],
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
    <div className="w-full rounded-2xl border border-slate-200/80 bg-white/92 p-4 shadow-[0_12px_36px_rgba(15,23,42,0.05)] md:p-5">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Filtro vivo</p>
          <h2 className="mt-2 text-lg font-semibold tracking-[-0.02em] text-slate-950">
            Refina el feed sin salirte de contexto.
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            El feed se actualiza al instante con posts y tools publicadas.
          </p>
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="self-start text-sm font-medium text-slate-500 transition hover:text-slate-700 md:self-auto"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <label className="mb-1.5 block text-[11px] uppercase tracking-[0.16em] text-slate-500">
            Buscar
          </label>
          <input
            type="text"
            placeholder="Nombre, tipo de IA, descripción..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-sky-300 focus:bg-white"
          />
        </div>

        <div className="lg:col-span-3">
          <label className="mb-1.5 block text-[11px] uppercase tracking-[0.16em] text-slate-500">
            Plan
          </label>
          <select
            value={filters.plan}
            onChange={(e) => updateFilter("plan", e.target.value as FilterState["plan"])}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-300 focus:bg-white"
          >
            {PLAN_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-white">
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="lg:col-span-3">
          <label className="mb-1.5 block text-[11px] uppercase tracking-[0.16em] text-slate-500">
            Categoría
          </label>
          <select
            value={filters.category}
            onChange={(e) => updateFilter("category", e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-300 focus:bg-white"
          >
            <option value="" className="bg-white">
              Todas
            </option>
            {categories.map((cat) => (
              <option key={cat} value={cat} className="bg-white">
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="lg:col-span-2">
          <label className="mb-1.5 block text-[11px] uppercase tracking-[0.16em] text-slate-500">
            Nivel
          </label>
          <select
            value={filters.level}
            onChange={(e) => updateFilter("level", e.target.value as FilterState["level"])}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-300 focus:bg-white"
          >
            {LEVEL_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-white">
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export type { FilterState };
