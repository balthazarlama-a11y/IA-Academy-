"use client";

import { useMemo, useState } from "react";

type ToolListFieldProps = {
  label: string;
  description: string;
  name: string;
  placeholder: string;
  addLabel: string;
  initialValues?: string[] | null;
  minRows?: number;
  colSpan?: string;
};

function normalizeRows(values: string[] | null | undefined, minRows: number) {
  const clean = (values ?? []).map((value) => value.trim());
  const next = clean.length > 0 ? clean : [""];
  while (next.length < minRows) next.push("");
  return next;
}

export default function ToolListField({
  label,
  description,
  name,
  placeholder,
  addLabel,
  initialValues,
  minRows = 1,
  colSpan = "md:col-span-2",
}: ToolListFieldProps) {
  const [rows, setRows] = useState<string[]>(() => normalizeRows(initialValues, minRows));

  const serialized = useMemo(
    () =>
      rows
        .map((value) => value.trim())
        .filter(Boolean)
        .join("\n"),
    [rows],
  );

  function updateRow(index: number, value: string) {
    setRows((current) => current.map((item, itemIndex) => (itemIndex === index ? value : item)));
  }

  function removeRow(index: number) {
    setRows((current) => {
      const next = current.filter((_, itemIndex) => itemIndex !== index);
      return normalizeRows(next, minRows);
    });
  }

  function addRow() {
    setRows((current) => [...current, ""]);
  }

  return (
    <div className={`rounded-lg border border-slate-200 bg-white p-4 ${colSpan}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</p>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>
        <button
          type="button"
          onClick={addRow}
          className="inline-flex items-center rounded-full border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
        >
          {addLabel}
        </button>
      </div>

      <div className="mt-4 space-y-2">
        {rows.map((row, index) => (
          <div key={`${name}-${index}`} className="flex items-center gap-2">
            <input
              value={row}
              onChange={(event) => updateRow(index, event.target.value)}
              placeholder={placeholder}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none"
            />
            <button
              type="button"
              onClick={() => removeRow(index)}
              className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-50"
              aria-label={`Eliminar ${label.toLowerCase()} ${index + 1}`}
            >
              Quitar
            </button>
          </div>
        ))}
      </div>

      <textarea name={name} readOnly value={serialized} className="hidden" />
    </div>
  );
}
