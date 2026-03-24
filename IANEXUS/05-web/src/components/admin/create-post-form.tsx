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
      className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-white transition-opacity disabled:opacity-50"
      style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)" }}
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
    <form action={createAction} className="space-y-6">
      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.18fr)_minmax(360px,0.82fr)] 2xl:grid-cols-[minmax(0,1.25fr)_minmax(420px,0.75fr)]">
        <div className="rounded-[1.65rem] border border-slate-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(249,250,251,0.96))] p-5 shadow-[0_14px_34px_rgba(15,23,42,0.04)]">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500">Ficha</p>
              <h4 className="mt-1 text-lg font-semibold text-slate-950">Identidad y publicación</h4>
            </div>
            <p className="text-xs text-slate-500">Campos de control editorial</p>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <input
              name="title"
              required
              placeholder="Título"
              className="md:col-span-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
            />
            <input
              name="slug"
              placeholder="slug-opcional"
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
            />
            <input
              name="ia_type"
              placeholder="Tipo IA (opcional)"
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
            />
            <input
              name="subtitle"
              placeholder="Subtítulo editorial"
              className="md:col-span-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
            />
            <textarea
              name="excerpt"
              rows={3}
              placeholder="Excerpt editorial"
              className="md:col-span-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-7 text-slate-900 outline-none transition focus:border-slate-400"
            />

            <div className="md:col-span-2 grid gap-3 lg:grid-cols-2">
              <select
                name="post_kind"
                defaultValue="blog"
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
              >
                <option value="blog">Blog</option>
                <option value="tool">Tool</option>
                <option value="guide">Guide</option>
                <option value="news">News</option>
              </select>
              <select
                name="status"
                defaultValue="draft"
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
              >
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
              <input
                type="datetime-local"
                name="published_at"
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
              />
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-xs leading-relaxed text-slate-500">
                <span className="block font-medium uppercase tracking-[0.16em] text-slate-400">
                  Consejo editorial
                </span>
                Ajusta el tipo y estado antes de escribir el cuerpo. Así el artículo nace con la
                jerarquía correcta.
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[1.65rem] border border-slate-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(249,250,251,0.96))] p-5 shadow-[0_14px_34px_rgba(15,23,42,0.04)]">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500">Portada</p>
              <h4 className="mt-1 text-lg font-semibold text-slate-950">Media y contexto visual</h4>
            </div>
            <p className="text-xs text-slate-500">Hero, alt y caption</p>
          </div>

          <div className="space-y-4">
            <UploadImageField
              fileInputName="cover_image_file"
              urlInputName="cover_image_url"
              label="Imagen de portada"
              colSpan=""
            />

            <div className="grid gap-3">
              <input
                name="hero_image_alt"
                placeholder="Alt de la imagen principal"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
              />
              <input
                name="hero_image_caption"
                placeholder="Caption de la imagen principal"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
              />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm leading-relaxed text-slate-600">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
                Orden recomendado
              </p>
              <p className="mt-2">
                Una buena portada funciona mejor cuando el recorte deja aire y el subtítulo sostiene
                la entrada al artículo.
              </p>
            </div>
          </div>
        </div>
      </section>

      <PostEditorComposer />

      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}
