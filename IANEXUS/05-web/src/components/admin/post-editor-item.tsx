"use client";

import { FileText } from "lucide-react";
import { useTransition, useState } from "react";
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

function kindLabel(kind: Post["post_kind"]) {
  switch (kind) {
    case "news":
      return "News";
    case "guide":
      return "Guide";
    case "tool":
      return "Tool";
    default:
      return "Blog";
  }
}

function statusTone(status: PostStatus) {
  switch (status) {
    case "published":
      return "border-emerald-200 bg-emerald-50 text-emerald-800";
    case "scheduled":
      return "border-amber-200 bg-amber-50 text-amber-800";
    case "archived":
      return "border-slate-200 bg-slate-100 text-slate-600";
    default:
      return "border-violet-200 bg-violet-50 text-violet-800";
  }
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-slate-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-50"
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
  defaultOpen = false,
}: {
  post: Post;
  updateAction: ActionFn;
  deleteAction: ActionFn;
  defaultOpen?: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

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
    <details
      className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_16px_36px_rgba(15,23,42,0.04)]"
      open={defaultOpen || undefined}
    >
      <summary className="cursor-pointer list-none px-5 py-4 transition hover:bg-slate-50/80">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                {kindLabel(post.post_kind)}
              </span>
              <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${statusTone(post.status)}`}>
                {post.status}
              </span>
            </div>
            <p className="mt-3 truncate text-[1.02rem] font-semibold tracking-tight text-slate-950 md:text-[1.1rem]">
              {post.title}
            </p>
            {post.subtitle ? (
              <p className="mt-1 truncate text-sm text-slate-500">{post.subtitle}</p>
            ) : null}
            {post.excerpt ? (
              <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-slate-500">
                {post.excerpt}
              </p>
            ) : null}
            <p className="mt-2 truncate text-xs text-slate-400">
              /{post.slug} · actualizado {formatDate(post.updated_at)}
            </p>
          </div>
          <FileText className="mt-1 h-4 w-4 shrink-0 text-slate-400" />
        </div>
      </summary>

      <div className="border-t border-slate-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(249,250,251,0.96))] p-5">
        <form action={updateAction} className="space-y-6">
          <input type="hidden" name="id" value={post.id} />

          <section className="grid gap-5 xl:grid-cols-[minmax(0,1.16fr)_minmax(360px,0.84fr)] 2xl:grid-cols-[minmax(0,1.24fr)_minmax(420px,0.76fr)]">
            <div className="rounded-[1.65rem] border border-slate-200 bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.04)]">
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
                  defaultValue={post.title}
                  disabled={isPending}
                  placeholder="Título"
                  className="md:col-span-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 disabled:opacity-50"
                />
                <input
                  name="slug"
                  required
                  defaultValue={post.slug}
                  disabled={isPending}
                  placeholder="slug"
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 disabled:opacity-50"
                />
                <input
                  name="ia_type"
                  defaultValue={post.ia_type ?? ""}
                  placeholder="Tipo IA"
                  disabled={isPending}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 disabled:opacity-50"
                />
                <input
                  name="subtitle"
                  defaultValue={post.subtitle ?? ""}
                  placeholder="Subtítulo editorial"
                  disabled={isPending}
                  className="md:col-span-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 disabled:opacity-50"
                />
                <textarea
                  name="excerpt"
                  rows={3}
                  defaultValue={post.excerpt ?? ""}
                  placeholder="Excerpt editorial"
                  disabled={isPending}
                  className="md:col-span-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-7 text-slate-900 outline-none transition focus:border-slate-400 disabled:opacity-50"
                />

                <div className="md:col-span-2 grid gap-3 lg:grid-cols-2">
                  <select
                    name="post_kind"
                    defaultValue={post.post_kind}
                    disabled={isPending}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 disabled:opacity-50"
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
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 disabled:opacity-50"
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
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 disabled:opacity-50"
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

            <div className="rounded-[1.65rem] border border-slate-200 bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.04)]">
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
                  existingUrl={post.cover_image_url}
                  label="Imagen de portada"
                  colSpan=""
                />

                <div className="grid gap-3">
                  <input
                    name="hero_image_alt"
                    defaultValue={post.hero_image_alt ?? ""}
                    placeholder="Alt de la imagen principal"
                    disabled={isPending}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 disabled:opacity-50"
                  />
                  <input
                    name="hero_image_caption"
                    defaultValue={post.hero_image_caption ?? ""}
                    placeholder="Caption de la imagen principal"
                    disabled={isPending}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 disabled:opacity-50"
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

          <PostEditorComposer
            initialContentMd={post.content_md}
            initialContentJson={post.content_json}
          />

          <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              {showConfirmDelete ? (
                <>
                  <span className="text-sm font-medium text-red-600">
                    ¿Confirmar eliminación?
                  </span>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isPending}
                    className="inline-flex items-center gap-1.5 rounded-full border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:opacity-50"
                  >
                    {isPending ? "Eliminando..." : "Sí, eliminar"}
                  </button>
                  <button
                    type="button"
                    onClick={cancelDelete}
                    disabled={isPending}
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Eliminar
                </button>
              )}
            </div>

            <SubmitButton />
          </div>
        </form>
      </div>
    </details>
  );
}
