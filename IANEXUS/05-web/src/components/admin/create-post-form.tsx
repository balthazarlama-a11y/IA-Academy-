"use client";

import { useFormStatus } from "react-dom";
import UploadImageField from "./upload-image-field";
import { PostEditorComposer } from "./post-editor-composer";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-50"
    >
      {pending ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          Creando...
        </>
      ) : (
        "Crear post"
      )}
    </button>
  );
}

export function CreatePostForm({
  createAction,
}: {
  createAction: (formData: FormData) => Promise<void>;
}) {
  return (
    <form action={createAction} className="mx-auto max-w-[1420px] space-y-5">
      <div className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 rounded-[1.8rem] border border-slate-200/80 bg-white/92 px-4 py-3 shadow-[0_12px_28px_rgba(15,23,42,0.05)] backdrop-blur">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
            Documento
          </p>
          <p className="mt-1 text-sm text-slate-600">
            Canvas principal para escribir. La publicación ahora vive dentro del mismo documento.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <SubmitButton />
        </div>
      </div>

      <section className="rounded-[2.3rem] border border-slate-200/90 bg-white px-6 py-7 shadow-[0_30px_60px_rgba(15,23,42,0.06)] md:px-10 md:py-9">
        <div className="mx-auto max-w-[1120px] space-y-7">
          <section className="rounded-[1.9rem] border border-slate-200 bg-[linear-gradient(180deg,rgba(250,251,255,0.96),rgba(255,255,255,0.98))] p-5 shadow-[0_14px_30px_rgba(15,23,42,0.04)]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                blog
              </span>
              <span className="inline-flex rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                draft
              </span>
            </div>
            <div className="mt-3 space-y-1">
              <p className="text-sm font-medium text-slate-900">
                Configuracion editorial obligatoria
              </p>
              <p className="text-sm text-slate-600">
                Completa estos campos antes de guardar. El post ya no depende de un panel aparte.
              </p>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <input
                name="slug"
                required
                placeholder="slug-del-post"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
              />
              <input
                name="ia_type"
                placeholder="Tipo IA (opcional)"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
              />
              <select
                name="post_kind"
                required
                defaultValue="blog"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
              >
                <option value="blog">Blog</option>
                <option value="tool">Tool</option>
                <option value="guide">Guide</option>
                <option value="news">News</option>
              </select>
              <select
                name="status"
                required
                defaultValue="draft"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
              >
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
              <input
                type="datetime-local"
                name="published_at"
                required
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 md:col-span-2"
              />
            </div>
          </section>

          <div className="space-y-4 border-b border-slate-200 pb-7">
            <input
              name="title"
              required
              placeholder="Escribe el título principal"
              className="w-full border-0 bg-transparent px-0 text-5xl font-semibold tracking-tight text-slate-950 outline-none placeholder:text-slate-300 md:text-6xl"
            />
            <input
              name="subtitle"
              placeholder="Subtítulo editorial"
              className="w-full border-0 bg-transparent px-0 text-xl leading-8 text-slate-600 outline-none placeholder:text-slate-400"
            />
            <textarea
              name="excerpt"
              rows={3}
              placeholder="Resumen breve para portada, cards y archivo."
              className="w-full border-0 bg-transparent px-0 text-base leading-8 text-slate-500 outline-none placeholder:text-slate-400"
            />
          </div>

          <section className="space-y-4 border-b border-slate-200 pb-8">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500">
                  Portada
                </p>
                <h3 className="mt-1 text-lg font-semibold text-slate-950">Hero y contexto visual</h3>
              </div>
              <p className="text-xs text-slate-500">Una sola imagen editorial</p>
            </div>

            <UploadImageField
              fileInputName="cover_image_file"
              urlInputName="cover_image_url"
              label="Imagen de portada"
              colSpan=""
            />

            <div className="grid gap-3 md:grid-cols-2">
              <input
                name="hero_image_alt"
                placeholder="Alt de la imagen principal"
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
              />
              <input
                name="hero_image_caption"
                placeholder="Caption de la imagen principal"
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
              />
            </div>
          </section>

          <PostEditorComposer />
        </div>
      </section>
    </form>
  );
}
