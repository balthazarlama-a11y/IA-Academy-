"use client";

import { Wrench } from "lucide-react";
import { useTransition } from "react";
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
  category_id: string;
  verified: boolean;
  edu_verified: boolean;
  featured: boolean;
  status: "draft" | "scheduled" | "published" | "archived";
  sort_order: number;
  updated_at: string;
  tool_categories: { name: string; slug: string } | { name: string; slug: string }[] | null;
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

function getToolCategoryName(value: Tool["tool_categories"]) {
  if (!value) return "Sin categoria";
  if (Array.isArray(value)) return value[0]?.name ?? "Sin categoria";
  return value.name;
}

export function ToolEditorItem({
  tool,
  categories,
  updateAction,
}: {
  tool: Tool;
  categories: ToolCategory[];
  updateAction: ActionFn;
}) {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(() => {
      updateAction(formData);
    });
  };

  return (
    <details className="rounded-xl border border-slate-200 bg-white">
      <summary className="cursor-pointer list-none px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-900">{tool.name}</p>
            <p className="truncate text-xs text-slate-500">
              /{tool.slug} - {tool.status} - {getToolCategoryName(tool.tool_categories)} - {formatDate(tool.updated_at)}
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
          />
          <select
            name="category_id"
            defaultValue={tool.category_id}
            required
            disabled={isPending}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none disabled:opacity-50"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
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
            <option value="edu_free">Edu Free</option>
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
            <input name="edu_verified" type="checkbox" defaultChecked={tool.edu_verified} disabled={isPending} /> Edu verificada
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-slate-700 md:col-span-2">
            <input name="featured" type="checkbox" defaultChecked={tool.featured} disabled={isPending} /> Destacada
          </label>

          <div className="md:col-span-2 flex justify-end">
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
