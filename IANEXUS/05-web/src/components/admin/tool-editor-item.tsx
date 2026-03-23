"use client";

import { Wrench } from "lucide-react";
import { useTransition, useState } from "react";
import UploadImageField from "./upload-image-field";

type ToolTaxonomy = { id: string; name: string; slug: string };
type ActionFn = (formData: FormData) => Promise<void>;

type Tool = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  tagline: string | null;
  editorial_summary: string | null;
  company_name: string | null;
  url: string;
  cover_image_url: string | null;
  screenshot_url: string | null;
  demo_video_url: string | null;
  platform_tags: string[] | null;
  language_codes: string[] | null;
  spanish_available: boolean;
  feature_bullets: string[] | null;
  faq_items: Array<{ question: string; answer: string }> | null;
  plan: "free" | "freemium" | "paid" | "edu_free";
  level: "beginner" | "intermediate" | "advanced" | "all";
  ia_type: string | null;
  verified: boolean;
  edu_verified: boolean;
  featured: boolean;
  status: "draft" | "scheduled" | "published" | "archived";
  sort_order: number;
  updated_at: string;
  tool_areas?: { sort_order: number; areas: ToolTaxonomy | ToolTaxonomy[] | null }[] | null;
  tool_use_cases?: { sort_order: number; use_cases: ToolTaxonomy | ToolTaxonomy[] | null }[] | null;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-CL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function getSelections<T extends ToolTaxonomy, K extends string>(
  rows: (Record<K, T | T[] | null> & { sort_order: number })[] | null | undefined,
  key: K,
) {
  return (rows ?? [])
    .map((entry) => entry[key])
    .map((value) => (Array.isArray(value) ? value[0] : value))
    .filter((value): value is T => Boolean(value));
}

export function ToolEditorItem({ tool, areas, useCases, updateAction, deleteAction, defaultOpen = false }: { tool: Tool; areas: ToolTaxonomy[]; useCases: ToolTaxonomy[]; updateAction: ActionFn; deleteAction: ActionFn; defaultOpen?: boolean }) {
  const [isPending, startTransition] = useTransition();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const selectedAreas = getSelections(tool.tool_areas, "areas");
  const selectedUseCases = getSelections(tool.tool_use_cases, "use_cases");
  const selectedAreaIds = new Set(selectedAreas.map((item) => item.id));
  const selectedUseCaseIds = new Set(selectedUseCases.map((item) => item.id));

  const handleSubmit = (formData: FormData) => {
    startTransition(() => updateAction(formData));
  };

  const handleDelete = () => {
    if (!showConfirmDelete) {
      setShowConfirmDelete(true);
      return;
    }
    const formData = new FormData();
    formData.append("id", tool.id);
    startTransition(() => deleteAction(formData));
  };

  return (
    <details className="rounded-xl border border-slate-200 bg-white" open={defaultOpen || undefined}>
      <summary className="cursor-pointer list-none px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-900">{tool.name}</p>
            <p className="truncate text-xs text-slate-500">/{tool.slug} - {tool.status} - {selectedAreas.map((item) => item.name).join(", ") || "Sin áreas"} - {formatDate(tool.updated_at)}</p>
          </div>
          <Wrench className="h-4 w-4 shrink-0 text-slate-500" />
        </div>
      </summary>

      <div className="border-t border-slate-200 p-4">
        <form action={handleSubmit} className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <input type="hidden" name="id" value={tool.id} />
          <input name="name" required defaultValue={tool.name} disabled={isPending} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none disabled:opacity-50" />
          <input name="slug" required defaultValue={tool.slug} disabled={isPending} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none disabled:opacity-50" />
          <input name="company_name" defaultValue={tool.company_name ?? ""} disabled={isPending} placeholder="Empresa / equipo creador" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none disabled:opacity-50" />
          <input name="tagline" defaultValue={tool.tagline ?? ""} disabled={isPending} placeholder="Tagline breve" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none disabled:opacity-50" />
          <textarea name="editorial_summary" rows={5} defaultValue={tool.editorial_summary ?? ""} disabled={isPending} placeholder="Resumen editorial largo: qué es, para quién sirve, cuándo conviene usarla y sus límites." className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm leading-6 text-slate-900 outline-none disabled:opacity-50 md:col-span-2" />
          <input name="demo_video_url" defaultValue={tool.demo_video_url ?? ""} disabled={isPending} placeholder="URL demo YouTube (opcional)" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none disabled:opacity-50 md:col-span-2" />
          <input name="url" required defaultValue={tool.url} disabled={isPending} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none disabled:opacity-50 md:col-span-2" />
          <textarea name="description" rows={3} defaultValue={tool.description ?? ""} disabled={isPending} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none disabled:opacity-50 md:col-span-2" />
          <UploadImageField fileInputName="cover_image_file" urlInputName="cover_image_url" existingUrl={tool.cover_image_url} label="Logo / imagen principal" colSpan="md:col-span-1" assetKind="logo" />
          <UploadImageField fileInputName="screenshot_file" urlInputName="screenshot_url" existingUrl={tool.screenshot_url} label="Screenshot / hero" colSpan="md:col-span-1" assetKind="cover" />

          <fieldset className="rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900">
            <legend className="px-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Áreas</legend>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {areas.map((area) => (
                <label key={area.id} className="inline-flex items-center gap-2 text-sm text-slate-700">
                  <input name="area_ids" type="checkbox" value={area.id} defaultChecked={selectedAreaIds.has(area.id)} disabled={isPending} />
                  <span>{area.name}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900">
            <legend className="px-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Casos de uso</legend>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {useCases.map((useCase) => (
                <label key={useCase.id} className="inline-flex items-center gap-2 text-sm text-slate-700">
                  <input name="use_case_ids" type="checkbox" value={useCase.id} defaultChecked={selectedUseCaseIds.has(useCase.id)} disabled={isPending} />
                  <span>{useCase.name}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <input name="ia_type" defaultValue={tool.ia_type ?? ""} disabled={isPending} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none disabled:opacity-50" />
          <textarea name="platform_tags" rows={2} defaultValue={(tool.platform_tags ?? []).join("\n")} disabled={isPending} placeholder="Plataformas, una por línea" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none disabled:opacity-50" />
          <textarea name="language_codes" rows={2} defaultValue={(tool.language_codes ?? []).join("\n")} disabled={isPending} placeholder="Idiomas, uno por línea" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none disabled:opacity-50" />
          <textarea name="feature_bullets" rows={4} defaultValue={(tool.feature_bullets ?? []).join("\n")} disabled={isPending} placeholder="Features clave, una por línea" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none disabled:opacity-50 md:col-span-2" />
          <textarea name="faq_items" rows={4} defaultValue={(tool.faq_items ?? []).map((item) => `${item.question} | ${item.answer}`).join("\n")} disabled={isPending} placeholder="FAQ: una por línea con formato Pregunta | Respuesta" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none disabled:opacity-50 md:col-span-2" />

          <select name="plan" defaultValue={tool.plan} disabled={isPending} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none disabled:opacity-50">
            <option value="free">Free</option>
            <option value="edu_free">Beneficio estudiantil</option>
            <option value="freemium">Freemium</option>
            <option value="paid">Paid</option>
          </select>
          <select name="level" defaultValue={tool.level} disabled={isPending} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none disabled:opacity-50">
            <option value="all">All</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          <select name="status" defaultValue={tool.status} disabled={isPending} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none disabled:opacity-50">
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
          <input name="sort_order" type="number" min={0} defaultValue={tool.sort_order} disabled={isPending} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none disabled:opacity-50" />

          <label className="inline-flex items-center gap-2 text-sm text-slate-700"><input name="verified" type="checkbox" defaultChecked={tool.verified} disabled={isPending} /> Verificada</label>
          <label className="inline-flex items-center gap-2 text-sm text-slate-700"><input name="edu_verified" type="checkbox" defaultChecked={tool.edu_verified} disabled={isPending} /> Verificación académica</label>
          <label className="inline-flex items-center gap-2 text-sm text-slate-700"><input name="spanish_available" type="checkbox" defaultChecked={tool.spanish_available} disabled={isPending} /> Interfaz en español</label>
          <label className="inline-flex items-center gap-2 text-sm text-slate-700 md:col-span-2"><input name="featured" type="checkbox" defaultChecked={tool.featured} disabled={isPending} /> Destacada</label>

          <div className="md:col-span-2 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {showConfirmDelete ? (
                <>
                  <span className="text-sm font-medium text-red-600">¿Confirmar eliminación?</span>
                  <button type="button" onClick={handleDelete} disabled={isPending} className="inline-flex items-center gap-1.5 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:opacity-50">{isPending ? "Eliminando..." : "Sí, eliminar"}</button>
                  <button type="button" onClick={() => setShowConfirmDelete(false)} disabled={isPending} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50">Cancelar</button>
                </>
              ) : (
                <button type="button" onClick={handleDelete} className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100">Eliminar</button>
              )}
            </div>

            <button type="submit" disabled={isPending} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-100 disabled:opacity-50">{isPending ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />Guardando...</> : "Guardar cambios"}</button>
          </div>
        </form>
      </div>
    </details>
  );
}
