"use client";

import { useTransition } from "react";
import UploadImageField from "./upload-image-field";
import UploadImageInline from "./upload-image-inline";

export function CreatePostForm({
  createAction,
}: {
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
        name="title"
        required
        placeholder="Titulo"
        disabled={isPending}
        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none disabled:opacity-50"
      />
      <input
        name="slug"
        placeholder="slug-opcional"
        disabled={isPending}
        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none disabled:opacity-50"
      />
      <UploadImageField
        fileInputName="cover_image_file"
        urlInputName="cover_image_url"
        label="Imagen de portada"
        colSpan="md:col-span-2"
      />
      <input
        name="ia_type"
        placeholder="Tipo IA (opcional)"
        disabled={isPending}
        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none disabled:opacity-50"
      />
      <select
        name="post_kind"
        defaultValue="blog"
        disabled={isPending}
        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none disabled:opacity-50"
      >
        <option value="blog">Blog</option>
        <option value="tool">Tool</option>
        <option value="guide">Guide</option>
        <option value="news">News</option>
      </select>
      <p className="text-xs text-slate-500 md:col-span-2">
        Tip: usa <strong>News</strong> para updates cortos y escaneables; usa <strong>Blog</strong> o <strong>Guide</strong> para contenido mas desarrollado.
      </p>
      <select
        name="status"
        defaultValue="draft"
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
        disabled={isPending}
        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none disabled:opacity-50"
      />
      <textarea
        name="excerpt"
        rows={2}
        placeholder="Excerpt (opcional)"
        disabled={isPending}
        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none disabled:opacity-50 md:col-span-2"
      />
      <div className="md:col-span-2">
        <UploadImageInline textareaId="content_md_new" folder="posts" />
      </div>
      <textarea
        id="content_md_new"
        name="content_md"
        rows={8}
        required
        placeholder="Contenido markdown"
        disabled={isPending}
        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none disabled:opacity-50 md:col-span-2"
      />
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
            "Crear post"
          )}
        </button>
      </div>
    </form>
  );
}
