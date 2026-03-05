"use client";

import { FileText } from "lucide-react";
import { useTransition, useState } from "react";
import UploadImageField from "./upload-image-field";
import UploadImageInline from "./upload-image-inline";

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content_md: string;
  cover_image_url: string | null;
  post_kind: "blog" | "tool" | "guide" | "news";
  ia_type: string | null;
  status: "draft" | "scheduled" | "published" | "archived";
  published_at: string | null;
  updated_at: string;
};

type ActionFn = (formData: FormData) => Promise<void>;

function toDatetimeLocal(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
}

function formatDate(value: string | null) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("es-CL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function PostEditorItem({
  post,
  updateAction,
  deleteAction,
  defaultOpen = false,
}: {
  post: Post;
  updateAction: ActionFn;
  deleteAction: ActionFn;
  defaultOpen?: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

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
    formData.append("id", post.id);
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
            <p className="truncate text-sm font-medium text-slate-900">{post.title}</p>
            <p className="truncate text-xs text-slate-500">
              /{post.slug} - {post.status} - {formatDate(post.updated_at)}
            </p>
          </div>
          <FileText className="h-4 w-4 shrink-0 text-slate-500" />
        </div>
      </summary>

      <div className="border-t border-slate-200 p-4">
        <form action={handleSubmit} className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <input type="hidden" name="id" value={post.id} />
          <input
            name="title"
            required
            defaultValue={post.title}
            disabled={isPending}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none disabled:opacity-50"
          />
          <input
            name="slug"
            required
            defaultValue={post.slug}
            disabled={isPending}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none disabled:opacity-50"
          />
          <UploadImageField
            fileInputName="cover_image_file"
            urlInputName="cover_image_url"
            existingUrl={post.cover_image_url}
            label="Imagen de portada"
            colSpan="md:col-span-2"
          />
          <input
            name="ia_type"
            defaultValue={post.ia_type ?? ""}
            placeholder="Tipo IA"
            disabled={isPending}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none disabled:opacity-50"
          />
          <select
            name="post_kind"
            defaultValue={post.post_kind}
            disabled={isPending}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none disabled:opacity-50"
          >
            <option value="blog">Blog</option>
            <option value="tool">Tool</option>
            <option value="guide">Guide</option>
            <option value="news">News</option>
          </select>
          <select
            name="status"
            defaultValue={post.status}
            disabled={isPending}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none disabled:opacity-50"
          >
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
          <input
            type="datetime-local"
            name="published_at"
            defaultValue={toDatetimeLocal(post.published_at)}
            disabled={isPending}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none disabled:opacity-50"
          />
          <textarea
            name="excerpt"
            rows={2}
            defaultValue={post.excerpt ?? ""}
            disabled={isPending}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none disabled:opacity-50 md:col-span-2"
          />
          <div className="md:col-span-2">
            <UploadImageInline textareaId={`content_md_${post.id}`} folder="posts" />
          </div>
          <textarea
            id={`content_md_${post.id}`}
            name="content_md"
            rows={8}
            required
            defaultValue={post.content_md}
            disabled={isPending}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none disabled:opacity-50 md:col-span-2"
          />
          
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
