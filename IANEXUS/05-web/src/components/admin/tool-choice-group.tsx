"use client";

import { useState } from "react";

type Option = {
  value: string;
  label: string;
};

type ToolChoiceGroupProps = {
  label: string;
  name: string;
  options: Option[];
  defaultValue: string;
  disabled?: boolean;
};

export default function ToolChoiceGroup({
  label,
  name,
  options,
  defaultValue,
  disabled = false,
}: ToolChoiceGroupProps) {
  const [selected, setSelected] = useState(defaultValue);

  return (
    <div>
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = selected === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setSelected(option.value)}
              disabled={disabled}
              className={`inline-flex items-center rounded-full border px-3.5 py-2 text-sm font-medium transition ${
                active
                  ? "border-slate-950 bg-slate-950 text-white shadow-[0_6px_14px_rgba(17,24,39,0.1)]"
                  : "border-slate-300/70 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
              } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
      <input type="hidden" name={name} value={selected} />
    </div>
  );
}
