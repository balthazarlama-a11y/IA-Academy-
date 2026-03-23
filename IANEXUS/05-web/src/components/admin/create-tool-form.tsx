"use client";

import { useTransition } from "react";
import UploadImageField from "./upload-image-field";

type ToolTaxonomy = {
  id: string;
  name: string;
  slug: string;
};

export function CreateToolForm({
  areas,
  useCases,
  createAction,
}: {
  areas: ToolTaxonomy[];
  useCases: ToolTaxonomy[];
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
      <input name="name" required placeholder="Nombre" disabled={isPending} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none disabled:opacity-50" />
      <input name="slug" placeholder="slug-opcional" disabled={isPending} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none disabled:opacity-50" />
      <input name="company_name" placeholder="Empresa / equipo creador" disabled={isPending} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none disabled:opacity-50" />
      <input name="tagline" placeholder="Tagline breve" disabled={isPending} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none disabled:opacity-50" />
      <input name="url" required placeholder="https://..." disabled={isPending} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none disabled:opacity-50 md:col-span-2" />
      <textarea name="description" rows={3} placeholder="Descripción editorial breve" disabled={isPending} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none disabled:opacity-50 md:col-span-2" />
      <UploadImageField fileInputName="cover_image_file" urlInputName="cover_image_url" label="Logo / imagen principal" colSpan="md:col-span-1" assetKind="logo" />
      <UploadImageField fileInputName="screenshot_file" urlInputName="screenshot_url" label="Screenshot / hero" colSpan="md:col-span-1" assetKind="cover" />

      <fieldset className="rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900">
        <legend className="px-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Áreas</legend>
        <p className="mb-3 text-xs text-slate-500">Selecciona una o varias áreas principales.</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {areas.map((area) => (
            <label key={area.id} className="inline-flex items-center gap-2 text-sm text-slate-700">
              <input name="area_ids" type="checkbox" value={area.id} disabled={isPending} />
              <span>{area.name}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900">
        <legend className="px-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Casos de uso</legend>
        <p className="mb-3 text-xs text-slate-500">Selecciona los escenarios donde esta tool aporta valor.</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {useCases.map((useCase) => (
            <label key={useCase.id} className="inline-flex items-center gap-2 text-sm text-slate-700">
              <input name="use_case_ids" type="checkbox" value={useCase.id} disabled={isPending} />
              <span>{useCase.name}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <input name="ia_type" placeholder="Tipo IA (opcional)" disabled={isPending} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none disabled:opacity-50" />
      <textarea name="platform_tags" rows={2} placeholder="Plataformas (una por línea o separadas por coma)" disabled={isPending} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none disabled:opacity-50" />
      <textarea name="language_codes" rows={2} placeholder="Idiomas (ej: es, en, pt)" disabled={isPending} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none disabled:opacity-50" />
      <textarea name="feature_bullets" rows={4} placeholder="Features clave, una por línea" disabled={isPending} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none disabled:opacity-50 md:col-span-2" />
      <textarea name="faq_items" rows={4} placeholder="FAQ: una por línea con formato Pregunta | Respuesta" disabled={isPending} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none disabled:opacity-50 md:col-span-2" />

      <select name="plan" defaultValue="free" disabled={isPending} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none disabled:opacity-50">
        <option value="free">Free</option>
        <option value="edu_free">Beneficio estudiantil</option>
        <option value="freemium">Freemium</option>
        <option value="paid">Paid</option>
      </select>
      <select name="level" defaultValue="all" disabled={isPending} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none disabled:opacity-50">
        <option value="all">All</option>
        <option value="beginner">Beginner</option>
        <option value="intermediate">Intermediate</option>
        <option value="advanced">Advanced</option>
      </select>
      <select name="status" defaultValue="published" disabled={isPending} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none disabled:opacity-50">
        <option value="draft">Draft</option>
        <option value="scheduled">Scheduled</option>
        <option value="published">Published</option>
        <option value="archived">Archived</option>
      </select>
      <input name="sort_order" type="number" min={0} defaultValue={0} disabled={isPending} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none disabled:opacity-50" />

      <label className="inline-flex items-center gap-2 text-sm text-slate-700"><input name="verified" type="checkbox" disabled={isPending} /> Verificada</label>
      <label className="inline-flex items-center gap-2 text-sm text-slate-700"><input name="edu_verified" type="checkbox" disabled={isPending} /> Verificación académica</label>
      <label className="inline-flex items-center gap-2 text-sm text-slate-700"><input name="spanish_available" type="checkbox" disabled={isPending} /> Interfaz en español</label>
      <label className="inline-flex items-center gap-2 text-sm text-slate-700 md:col-span-2"><input name="featured" type="checkbox" disabled={isPending} /> Destacada</label>

      <div className="md:col-span-2 flex justify-end">
        <button type="submit" disabled={isPending} className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-opacity disabled:opacity-50" style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)" }}>
          {isPending ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />Creando...</> : "Crear tool"}
        </button>
      </div>
    </form>
  );
}
