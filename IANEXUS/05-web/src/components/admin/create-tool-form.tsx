"use client";

import { useTransition } from "react";
import UploadImageField from "./upload-image-field";

type ToolCategory = {
  id: string;
  name: string;
  slug: string;
};

export function CreateToolForm({
  careers,
  createAction,
}: {
  careers: ToolCategory[];
  createAction: (formData: FormData) => Promise<void>;
}) {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(() => {
      createAction(formData);
    });
  };

  return (
    <form action={handleSubmit} className="grid grid-cols-1 gap-3 md:grid-cols-2">
      <input
        name="name"
        required
        placeholder="Nombre"
        disabled={isPending}
        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none disabled:opacity-50"
      />
      <input
        name="slug"
        placeholder="slug-opcional"
        disabled={isPending}
        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none disabled:opacity-50"
      />
      <input
        name="url"
        required
        placeholder="https://..."
        disabled={isPending}
        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none disabled:opacity-50 md:col-span-2"
      />
      <textarea
        name="description"
        rows={2}
        placeholder="Descripcion"
        disabled={isPending}
        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none disabled:opacity-50 md:col-span-2"
      />
      <UploadImageField fileInputName="cover_image_file" urlInputName="cover_image_url" label="Imagen / logo" colSpan="md:col-span-2" assetKind="logo" />
      <fieldset className="rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 md:col-span-2">
        <legend className="px-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Carreras</legend>
        <p className="mb-3 text-xs text-slate-500">Selecciona una o varias carreras para clasificar la tool.</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {careers.map((career) => (
            <label key={career.id} className="inline-flex items-center gap-2 text-sm text-slate-700">
              <input name="career_ids" type="checkbox" value={career.id} disabled={isPending} />
              <span>{career.name}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <input
        name="ia_type"
        placeholder="Tipo IA (opcional)"
        disabled={isPending}
        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none disabled:opacity-50"
      />
      <select
        name="plan"
        defaultValue="free"
        disabled={isPending}
        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none disabled:opacity-50"
      >
        <option value="free">Free</option>
        <option value="edu_free">Beneficio estudiantil</option>
        <option value="freemium">Freemium</option>
        <option value="paid">Paid</option>
      </select>
      <select
        name="level"
        defaultValue="all"
        disabled={isPending}
        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none disabled:opacity-50"
      >
        <option value="all">All</option>
        <option value="beginner">Beginner</option>
        <option value="intermediate">Intermediate</option>
        <option value="advanced">Advanced</option>
      </select>
      <select
        name="status"
        defaultValue="published"
        disabled={isPending}
        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none disabled:opacity-50"
      >
        <option value="draft">Draft</option>
        <option value="scheduled">Scheduled</option>
        <option value="published">Published</option>
        <option value="archived">Archived</option>
      </select>
      <input
        name="sort_order"
        type="number"
        min={0}
        defaultValue={0}
        disabled={isPending}
        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none disabled:opacity-50"
      />

      <label className="inline-flex items-center gap-2 text-sm text-slate-700">
        <input name="verified" type="checkbox" disabled={isPending} /> Verificada
      </label>
      <label className="inline-flex items-center gap-2 text-sm text-slate-700">
        <input name="edu_verified" type="checkbox" disabled={isPending} /> Verificación académica
      </label>
      <label className="inline-flex items-center gap-2 text-sm text-slate-700 md:col-span-2">
        <input name="featured" type="checkbox" disabled={isPending} /> Destacada
      </label>

      <div className="md:col-span-2 flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-opacity disabled:opacity-50"
          style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)" }}
        >
          {isPending ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Creando...
            </>
          ) : (
            "Crear tool"
          )}
        </button>
      </div>
    </form>
  );
}
