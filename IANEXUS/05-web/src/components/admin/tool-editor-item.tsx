"use client";

import { Wrench } from "lucide-react";
import { useTransition, useState } from "react";
import UploadImageField from "./upload-image-field";

type Tool = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  url: string;
  cover_image_url: string | null;
  plan: "free" | "freemium" | "paid" | "edu_free";
  level: "beginner" | "intermediate" | "advanced" | "all";
  ia_type: string | null;
  verified: boolean;
  edu_verified: boolean;
  featured: boolean;
  status: "draft" | "scheduled" | "published" | "archived";
  sort_order: number;
  updated_at: string;
  tool_careers?:
    | {
        career_paths:
          | { id: string; name: string; slug: string }
          | { id: string; name: string; slug: string }[]
          | null;
      }[]
    | null;
};

type ToolCategory = {
  id: string;
  name: string;
  slug: string;
};

type ActionFn = (formData: FormData) => Promise<void>;

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-CL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function getToolCareerSelections(tool: Tool) {
  return (tool.tool_careers ?? [])
    .map((entry) => (Array.isArray(entry.career_paths) ? entry.career_paths[0] : entry.career_paths))
    .filter((career): career is { id: string; name: string; slug: string } => Boolean(career));
}

export function ToolEditorItem({
  tool,
  careers,
  categories,
  updateAction,
  deleteAction,
  defaultOpen = false,
}: {
  tool: Tool;
  careers?: ToolCategory[];
  categories?: ToolCategory[];
  updateAction: ActionFn;
  deleteAction: ActionFn;
  defaultOpen?: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const availableCareers = careers ?? categories ?? [];
  const selectedCareers = getToolCareerSelections(tool);
  const selectedCareerIds = new Set(selectedCareers.map((career) => career.id));
  const selectedCareerLabel = selectedCareers.map((career) => career.name).join(", ");

  const handleSubmit = (formData: FormData) => {
    startTransition(() => {
      updateAction(formData);
    });
  };

  const handleDelete = () => {
    if (!showConfirmDelete) {
      setShowConfirmDelete(true);
      return;
    }
    const formData = new FormData();
    formData.append("id", tool.id);
    startTransition(() => {
      deleteAction(formData);
    });
  };

  const cancelDelete = () => {
    setShowConfirmDelete(false);
  };

  return (
    <details className="rounded-xl border border-slate-200 bg-white" open={defaultOpen || undefined}>
      <summary className="cursor-pointer list-none px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-900">{tool.name}</p>
            <p className="truncate text-xs text-slate-500">
              /{tool.slug} - {tool.status} - {selectedCareerLabel || "Sin carreras"} - {formatDate(tool.updated_at)}
            </p>
          </div>
          <Wrench className="h-4 w-4 shrink-0 text-slate-500" />
        </div>
      </summary>

      <div className="border-t border-slate-200 p-4">
        <form action={handleSubmit} className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <input type="hidden" name="id" value={tool.id} />
          <input
            name="name"
            required
            defaultValue={tool.name}
            disabled={isPending}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none disabled:opacity-50"
          />
          <input
            name="slug"
            required
            defaultValue={tool.slug}
            disabled={isPending}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none disabled:opacity-50"
          />
          <input
            name="url"
            required
            defaultValue={tool.url}
            disabled={isPending}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none disabled:opacity-50 md:col-span-2"
          />
          <textarea
            name="description"
            rows={2}
            defaultValue={tool.description ?? ""}
            disabled={isPending}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none disabled:opacity-50 md:col-span-2"
          />
          <UploadImageField
            fileInputName="cover_image_file"
            urlInputName="cover_image_url"
            existingUrl={tool.cover_image_url}
            label="Imagen / logo"
            colSpan="md:col-span-2"
            assetKind="logo"
          />
          <fieldset className="rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 md:col-span-2">
            <legend className="px-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Carreras</legend>
            <p className="mb-3 text-xs text-slate-500">Selecciona las carreras que mejor representan esta tool.</p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {availableCareers.map((career) => (
                <label key={career.id} className="inline-flex items-center gap-2 text-sm text-slate-700">
                  <input
                    name="career_ids"
                    type="checkbox"
                    value={career.id}
                    defaultChecked={selectedCareerIds.has(career.id)}
                    disabled={isPending}
                  />
                  <span>{career.name}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <input
            name="ia_type"
            defaultValue={tool.ia_type ?? ""}
            disabled={isPending}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none disabled:opacity-50"
          />
          <select
            name="plan"
            defaultValue={tool.plan}
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
            defaultValue={tool.level}
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
            defaultValue={tool.status}
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
            defaultValue={tool.sort_order}
            disabled={isPending}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none disabled:opacity-50"
          />

          <label className="inline-flex items-center gap-2 text-sm text-slate-700">
            <input name="verified" type="checkbox" defaultChecked={tool.verified} disabled={isPending} /> Verificada
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-slate-700">
            <input name="edu_verified" type="checkbox" defaultChecked={tool.edu_verified} disabled={isPending} /> Verificación académica
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-slate-700 md:col-span-2">
            <input name="featured" type="checkbox" defaultChecked={tool.featured} disabled={isPending} /> Destacada
          </label>

          {/* Botones de acción */}
          <div className="md:col-span-2 flex items-center justify-between gap-3">
            {/* Botón Eliminar con confirmación */}
            <div className="flex items-center gap-2">
              {showConfirmDelete ? (
                <>
                  <span className="text-sm text-red-600 font-medium">
                    ¿Confirmar eliminación?
                  </span>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isPending}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:opacity-50"
                  >
                    {isPending ? "Eliminando..." : "Sí, eliminar"}
                  </button>
                  <button
                    type="button"
                    onClick={cancelDelete}
                    disabled={isPending}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  Eliminar
                </button>
              )}
            </div>

            {/* Botón Guardar */}
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-100 disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
                  Guardando...
                </>
              ) : (
                "Guardar cambios"
              )}
            </button>
          </div>
        </form>
      </div>
    </details>
  );
}
