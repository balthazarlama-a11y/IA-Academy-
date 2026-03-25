"use client";

import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import UploadImageField from "./upload-image-field";
import { PostEditorComposer } from "./post-editor-composer";
import type { PostDetail, PostStatus, PostSummary } from "@/lib/types/post";

type Post = PostSummary & {
  content_md: string;
  content_json: PostDetail["content_json"];
  status: PostStatus;
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

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-50"
    >
      {pending ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          Guardando...
        </>
      ) : (
        "Guardar cambios"
      )}
    </button>
  );
}

export function PostEditorItem({
  post,
  updateAction,
  deleteAction,
}: {
  post: Post;
  updateAction: ActionFn;
  deleteAction: ActionFn;
}) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isPending, startTransition] = useTransition();

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

  return (
    <form action={updateAction} className="mx-auto max-w-[1420px] space-y-5">
      <input type="hidden" name="id" value={post.id} />

      <div className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 rounded-[1.8rem] border border-slate-200/80 bg-white/92 px-4 py-3 shadow-[0_12px_28px_rgba(15,23,42,0.05)] backdrop-blur">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              {post.post_kind}
            </span>
            <span className="inline-flex rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              {post.status}
            </span>
          </div>
          <p className="text-sm text-slate-600">
            Documento principal libre. La publicacion y las acciones viven dentro del flujo del documento.
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
                {post.post_kind}
              </span>
              <span className="inline-flex rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                {post.status}
              </span>
            </div>
            <div className="mt-3 space-y-1">
              <p className="text-sm font-medium text-slate-900">
                Configuracion editorial obligatoria
              </p>
              <p className="text-sm text-slate-600">
                Antes de guardar, el slug, tipo, estado, fecha y tipo IA deben quedar definidos en esta misma card.
              </p>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <input
                name="slug"
                required
                defaultValue={post.slug}
                disabled={isPending}
                placeholder="slug"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 disabled:opacity-50"
              />
              <input
                name="ia_type"
                defaultValue={post.ia_type ?? ""}
                disabled={isPending}
                placeholder="Tipo IA (opcional)"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 disabled:opacity-50"
              />
              <select
                name="post_kind"
                required
                defaultValue={post.post_kind}
                disabled={isPending}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 disabled:opacity-50"
              >
                <option value="blog">Blog</option>
                <option value="tool">Tool</option>
                <option value="guide">Guide</option>
                <option value="news">News</option>
              </select>
              <select
                name="status"
                required
                defaultValue={post.status}
                disabled={isPending}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 disabled:opacity-50"
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
                defaultValue={toDatetimeLocal(post.published_at)}
                disabled={isPending}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 disabled:opacity-50 md:col-span-2"
              />
            </div>

            <div className="mt-4 rounded-[1.4rem] border border-red-200 bg-red-50 p-4">
              {showConfirmDelete ? (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-red-700">¿Confirmar eliminación?</p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={isPending}
                      className="inline-flex flex-1 items-center justify-center rounded-full border border-red-300 bg-red-100 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-200 disabled:opacity-50"
                    >
                      {isPending ? "Eliminando..." : "Sí, eliminar"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowConfirmDelete(false)}
                      disabled={isPending}
                      className="inline-flex flex-1 items-center justify-center rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:opacity-50"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="inline-flex w-full items-center justify-center rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100"
                >
                  Eliminar post
                </button>
              )}
            </div>
          </section>

          <div className="space-y-4 border-b border-slate-200 pb-7">
            <input
              name="title"
              required
              defaultValue={post.title}
              disabled={isPending}
              placeholder="Escribe el título principal"
              className="w-full border-0 bg-transparent px-0 text-5xl font-semibold tracking-tight text-slate-950 outline-none placeholder:text-slate-300 disabled:opacity-50 md:text-6xl"
            />
            <input
              name="subtitle"
              defaultValue={post.subtitle ?? ""}
              disabled={isPending}
              placeholder="Subtítulo editorial"
              className="w-full border-0 bg-transparent px-0 text-xl leading-8 text-slate-600 outline-none placeholder:text-slate-400 disabled:opacity-50"
            />
            <textarea
              name="excerpt"
              rows={3}
              defaultValue={post.excerpt ?? ""}
              disabled={isPending}
              placeholder="Resumen breve para portada, cards y archivo."
              className="w-full border-0 bg-transparent px-0 text-base leading-8 text-slate-500 outline-none placeholder:text-slate-400 disabled:opacity-50"
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
              existingUrl={post.cover_image_url}
              label="Imagen de portada"
              colSpan=""
            />

            <div className="grid gap-3 md:grid-cols-2">
              <input
                name="hero_image_alt"
                defaultValue={post.hero_image_alt ?? ""}
                disabled={isPending}
                placeholder="Alt de la imagen principal"
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 disabled:opacity-50"
              />
              <input
                name="hero_image_caption"
                defaultValue={post.hero_image_caption ?? ""}
                disabled={isPending}
                placeholder="Caption de la imagen principal"
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 disabled:opacity-50"
              />
            </div>
          </section>

          <PostEditorComposer
            initialContentMd={post.content_md}
            initialContentJson={post.content_json}
          />
        </div>
      </section>
    </form>
  );
}
