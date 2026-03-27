"use client";

import { useMemo, useState } from "react";

type FaqItem = {
  question: string;
  answer: string;
};

type ToolFaqFieldProps = {
  initialValues?: FaqItem[] | null;
  name?: string;
  colSpan?: string;
};

function normalizeRows(values: FaqItem[] | null | undefined) {
  const clean = (values ?? []).map((item) => ({
    question: item.question?.trim() ?? "",
    answer: item.answer?.trim() ?? "",
  }));
  return clean.length > 0 ? clean : [{ question: "", answer: "" }];
}

export default function ToolFaqField({
  initialValues,
  name = "faq_items",
  colSpan = "md:col-span-2",
}: ToolFaqFieldProps) {
  const [rows, setRows] = useState<FaqItem[]>(() => normalizeRows(initialValues));

  const serialized = useMemo(
    () =>
      rows
        .map((item) => ({
          question: item.question.trim(),
          answer: item.answer.trim(),
        }))
        .filter((item) => item.question && item.answer)
        .map((item) => `${item.question} | ${item.answer}`)
        .join("\n"),
    [rows],
  );

  function updateRow(index: number, key: keyof FaqItem, value: string) {
    setRows((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item,
      ),
    );
  }

  function addRow() {
    setRows((current) => [...current, { question: "", answer: "" }]);
  }

  function removeRow(index: number) {
    setRows((current) => {
      const next = current.filter((_, itemIndex) => itemIndex !== index);
      return next.length > 0 ? next : [{ question: "", answer: "" }];
    });
  }

  return (
    <div className={`rounded-lg border border-slate-200 bg-white p-4 ${colSpan}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Preguntas frecuentes
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Completa cada pregunta en su campo y responde debajo. El formulario lo serializa para Supabase.
          </p>
        </div>
        <button
          type="button"
          onClick={addRow}
          className="inline-flex items-center rounded-full border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
        >
          Agregar FAQ
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {rows.map((row, index) => (
          <div key={`faq-${index}`} className="rounded-lg border border-slate-200 bg-slate-50/60 p-3">
            <div className="grid gap-3 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)_auto] md:items-start">
              <input
                value={row.question}
                onChange={(event) => updateRow(index, "question", event.target.value)}
                placeholder="Pregunta"
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none"
              />
              <textarea
                value={row.answer}
                onChange={(event) => updateRow(index, "answer", event.target.value)}
                placeholder="Respuesta"
                rows={2}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none"
              />
              <button
                type="button"
                onClick={() => removeRow(index)}
                className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100"
              >
                Quitar
              </button>
            </div>
          </div>
        ))}
      </div>

      <textarea name={name} readOnly value={serialized} className="hidden" />
    </div>
  );
}
