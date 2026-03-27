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
    <div className="w-full rounded-[1.1rem] ui-panel p-3.5 md:rounded-[1.3rem] md:p-5">
      <div className="flex flex-col gap-3 border-b ui-rule pb-3.5 md:pb-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="ui-label">Filtrar feed</p>
          <h2 className="mt-1 text-base font-semibold tracking-[-0.02em] text-slate-950 md:text-lg">
            Ajusta la lectura sin salir de la misma vista.
          </h2>
        </div>

        {hasActiveFilters ? (
          <button
            onClick={clearFilters}
            className="self-start text-sm font-medium text-slate-500 transition hover:text-slate-700 md:self-auto"
          >
            Limpiar filtros
          </button>
        ) : null}
      </div>

      <div className="mt-3.5 grid grid-cols-1 gap-2.5 md:mt-4 md:gap-3 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <label className="mb-1.5 block text-[11px] uppercase tracking-[0.16em] text-slate-500">
            Buscar
          </label>
          <input
            type="text"
            placeholder="Título, descripción o tipo de IA"
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="ui-input w-full rounded-[0.85rem] px-3.5 py-2.5 text-[13px] placeholder:text-slate-400 outline-none transition md:rounded-[0.9rem] md:px-4 md:py-3 md:text-sm"
          />
        </div>

        <div className="lg:col-span-3">
          <label className="mb-1.5 block text-[11px] uppercase tracking-[0.16em] text-slate-500">
            Plan
          </label>
          <select
            value={filters.plan}
            onChange={(e) => updateFilter("plan", e.target.value as FilterState["plan"])}
            className="ui-select w-full rounded-[0.85rem] px-3.5 py-2.5 text-[13px] outline-none transition md:rounded-[0.9rem] md:px-4 md:py-3 md:text-sm"
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
            Tema
          </label>
          <select
            value={filters.category}
            onChange={(e) => updateFilter("category", e.target.value)}
            className="ui-select w-full rounded-[0.85rem] px-3.5 py-2.5 text-[13px] outline-none transition md:rounded-[0.9rem] md:px-4 md:py-3 md:text-sm"
          >
            <option value="" className="bg-white">
              Todos
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
            className="ui-select w-full rounded-[0.85rem] px-3.5 py-2.5 text-[13px] outline-none transition md:rounded-[0.9rem] md:px-4 md:py-3 md:text-sm"
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
