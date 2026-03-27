"use client";

import { Wrench } from "lucide-react";
import { useTransition, useState } from "react";
import { useFormStatus } from "react-dom";
import ToolChoiceGroup from "./tool-choice-group";
import ToolFaqField from "./tool-faq-field";
import ToolListField from "./tool-list-field";
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

const PLAN_OPTIONS = [
  { value: "free", label: "Free" },
  { value: "edu_free", label: "Beneficio estudiantil" },
  { value: "freemium", label: "Freemium" },
  { value: "paid", label: "Paid" },
];

const LEVEL_OPTIONS = [
  { value: "all", label: "All" },
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "scheduled", label: "Scheduled" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

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

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-100 disabled:opacity-50"
    >
      {pending ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
          Guardando...
        </>
      ) : (
        "Guardar cambios"
      )}
    </button>
  );
}

export function ToolEditorItem({ tool, areas, useCases, updateAction, deleteAction, defaultOpen = false }: { tool: Tool; areas: ToolTaxonomy[]; useCases: ToolTaxonomy[]; updateAction: ActionFn; deleteAction: ActionFn; defaultOpen?: boolean }) {
  const [isPending, startTransition] = useTransition();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const selectedAreas = getSelections(tool.tool_areas, "areas");
  const selectedUseCases = getSelections(tool.tool_use_cases, "use_cases");
  const selectedAreaIds = new Set(selectedAreas.map((item) => item.id));
  const selectedUseCaseIds = new Set(selectedUseCases.map((item) => item.id));

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
        <form action={updateAction} className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <input type="hidden" name="id" value={tool.id} />
          <div className="rounded-lg border border-slate-200 bg-white p-4 md:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Información base</p>
            <p className="mt-1 text-sm text-slate-500">Edita la identidad pública de la tool y su resumen editorial.</p>
            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
              <input name="name" required defaultValue={tool.name} disabled={isPending} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none disabled:opacity-50" />
              <input name="slug" required defaultValue={tool.slug} disabled={isPending} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none disabled:opacity-50" />
              <input name="company_name" defaultValue={tool.company_name ?? ""} disabled={isPending} placeholder="Empresa / equipo creador" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none disabled:opacity-50" />
              <input name="tagline" defaultValue={tool.tagline ?? ""} disabled={isPending} placeholder="Tagline breve" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none disabled:opacity-50" />
              <input name="url" required defaultValue={tool.url} disabled={isPending} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none disabled:opacity-50 md:col-span-2" />
              <textarea name="description" rows={3} defaultValue={tool.description ?? ""} disabled={isPending} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none disabled:opacity-50 md:col-span-2" />
              <textarea name="editorial_summary" rows={5} defaultValue={tool.editorial_summary ?? ""} disabled={isPending} placeholder="Resumen editorial largo: qué es, para quién sirve, cuándo conviene usarla y sus límites." className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm leading-6 text-slate-900 outline-none disabled:opacity-50 md:col-span-2" />
              <input name="demo_video_url" defaultValue={tool.demo_video_url ?? ""} disabled={isPending} placeholder="URL demo YouTube (opcional)" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none disabled:opacity-50 md:col-span-2" />
            </div>
          </div>
          <UploadImageField fileInputName="cover_image_file" urlInputName="cover_image_url" existingUrl={tool.cover_image_url} label="Imagen principal" colSpan="md:col-span-2" assetKind="cover" />

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

          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Metadatos</p>
            <p className="mt-1 text-sm text-slate-500">Datos de clasificación visibles en la ficha pública.</p>
            <div className="mt-4 grid gap-3">
              <input name="ia_type" defaultValue={tool.ia_type ?? ""} disabled={isPending} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none disabled:opacity-50" />
              <textarea name="platform_tags" rows={2} defaultValue={(tool.platform_tags ?? []).join("\n")} disabled={isPending} placeholder="Plataformas, una por línea" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none disabled:opacity-50" />
              <textarea name="language_codes" rows={2} defaultValue={(tool.language_codes ?? []).join("\n")} disabled={isPending} placeholder="Idiomas, uno por línea" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none disabled:opacity-50" />
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Publicación</p>
            <p className="mt-1 text-sm text-slate-500">Plan, estado y visibilidad general.</p>
            <div className="mt-4 grid gap-3">
              <ToolChoiceGroup label="Plan" name="plan" options={PLAN_OPTIONS} defaultValue={tool.plan} disabled={isPending} />
              <ToolChoiceGroup label="Nivel" name="level" options={LEVEL_OPTIONS} defaultValue={tool.level} disabled={isPending} />
              <ToolChoiceGroup label="Estado" name="status" options={STATUS_OPTIONS} defaultValue={tool.status} disabled={isPending} />
              <input name="sort_order" type="number" min={0} defaultValue={tool.sort_order} disabled={isPending} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none disabled:opacity-50" />
              <label className="inline-flex items-center gap-2 text-sm text-slate-700"><input name="verified" type="checkbox" defaultChecked={tool.verified} disabled={isPending} /> Verificada</label>
              <label className="inline-flex items-center gap-2 text-sm text-slate-700"><input name="edu_verified" type="checkbox" defaultChecked={tool.edu_verified} disabled={isPending} /> Verificación académica</label>
              <label className="inline-flex items-center gap-2 text-sm text-slate-700"><input name="spanish_available" type="checkbox" defaultChecked={tool.spanish_available} disabled={isPending} /> Interfaz en español</label>
              <label className="inline-flex items-center gap-2 text-sm text-slate-700"><input name="featured" type="checkbox" defaultChecked={tool.featured} disabled={isPending} /> Destacada</label>
            </div>
          </div>

          <ToolListField
            label="Features clave"
            description="Cada feature se completa en su propia fila y el formulario lo serializa automáticamente."
            name="feature_bullets"
            placeholder="Ej: Genera video desde texto con control de cámara"
            addLabel="Agregar feature"
            initialValues={tool.feature_bullets}
          />
          <ToolFaqField initialValues={tool.faq_items} />

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

            <SubmitButton />
          </div>
        </form>
      </div>
    </details>
  );
}
