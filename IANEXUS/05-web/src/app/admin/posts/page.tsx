import Link from "next/link";
import { FileText } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/session";
import { getSupabaseServerAuthClient } from "@/lib/supabase/server";
import UploadImageField from "@/components/admin/upload-image-field";
import UploadImageInline from "@/components/admin/upload-image-inline";
import { createPostAction, updatePostAction } from "./actions";

export const metadata = {
  title: "Posts - Admin IA NEXUS",
};

type AdminPostRow = {
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

async function ensureStaffUser() {
  const user = await getCurrentUser();
  const role = user?.role ?? null;
  if (!user || (role !== "admin" && role !== "master")) {
    throw new Error("No autorizado");
  }
  return user;
}

export default async function AdminPostsPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; err?: string }>;
}) {
  await ensureStaffUser();
  const supabase = await getSupabaseServerAuthClient();

  const params = await searchParams;
  const successMessage = params.ok ?? "";
  const errorMessage = params.err ?? "";

  const { data } = await supabase
    .from("posts")
    .select("id, title, slug, excerpt, content_md, cover_image_url, post_kind, ia_type, status, published_at, updated_at")
    .order("updated_at", { ascending: false })
    .limit(100);

  const posts = ((data ?? []) as AdminPostRow[]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Posts</h2>
          <p className="text-sm text-slate-500">Crea y edita contenido del blog.</p>
        </div>
        <Link
          href="/admin/tools"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 transition hover:bg-slate-50"
        >
          Ir a Tools
        </Link>
      </div>

      {successMessage ? (
        <div className="rounded-xl border border-emerald-300/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-700">
          {successMessage}
        </div>
      ) : null}

      {errorMessage ? (
        <div className="rounded-xl border border-red-300/30 bg-red-400/10 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      <section
        className="rounded-2xl p-5"
        style={{ background: "rgba(255, 255, 255, 0.88)", border: "1px solid rgba(148, 163, 184, 0.32)" }}
      >
        <h3 className="mb-4 text-lg font-medium text-slate-900">Nuevo post</h3>
        <form action={createPostAction} encType="multipart/form-data" className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <input name="title" required placeholder="Titulo" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none" />
          <input name="slug" placeholder="slug-opcional" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none" />
          <UploadImageField fileInputName="cover_image_file" urlInputName="cover_image_url" label="Imagen de portada" colSpan="md:col-span-2" />
          <input name="ia_type" placeholder="Tipo IA (opcional)" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none" />
          <select name="post_kind" defaultValue="blog" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none">
            <option value="blog">Blog</option>
            <option value="tool">Tool</option>
            <option value="guide">Guide</option>
            <option value="news">News</option>
          </select>
          <select name="status" defaultValue="draft" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none">
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
          <input type="datetime-local" name="published_at" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none" />
          <textarea name="excerpt" rows={2} placeholder="Excerpt (opcional)" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none md:col-span-2" />
          <div className="md:col-span-2">
            <UploadImageInline textareaId="content_md_new" folder="posts" />
          </div>
          <textarea id="content_md_new" name="content_md" rows={8} required placeholder="Contenido markdown" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none md:col-span-2" />
          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white"
              style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)" }}
            >
              Crear post
            </button>
          </div>
        </form>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-medium text-slate-900">Posts existentes ({posts.length})</h3>

        {posts.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
            No hay posts todavía.
          </div>
        ) : (
          posts.map((post) => (
            <details
              key={post.id}
              className="rounded-xl border border-slate-200 bg-white"
            >
              <summary className="cursor-pointer list-none px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{post.title}</p>
                    <p className="text-xs text-slate-500">/{post.slug} - {post.status} - {formatDate(post.updated_at)}</p>
                  </div>
                  <FileText className="h-4 w-4 text-slate-500" />
                </div>
              </summary>

              <div className="border-t border-slate-200 p-4">
                <form action={updatePostAction} encType="multipart/form-data" className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <input type="hidden" name="id" value={post.id} />
                  <input name="title" required defaultValue={post.title} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none" />
                  <input name="slug" required defaultValue={post.slug} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none" />
                  <UploadImageField fileInputName="cover_image_file" urlInputName="cover_image_url" existingUrl={post.cover_image_url} label="Imagen de portada" colSpan="md:col-span-2" />
                  <input name="ia_type" defaultValue={post.ia_type ?? ""} placeholder="Tipo IA" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none" />
                  <select name="post_kind" defaultValue={post.post_kind} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none">
                    <option value="blog">Blog</option>
                    <option value="tool">Tool</option>
                    <option value="guide">Guide</option>
                    <option value="news">News</option>
                  </select>
                  <select name="status" defaultValue={post.status} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none">
                    <option value="draft">Draft</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                  <input type="datetime-local" name="published_at" defaultValue={toDatetimeLocal(post.published_at)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none" />
                  <textarea name="excerpt" rows={2} defaultValue={post.excerpt ?? ""} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none md:col-span-2" />
                  <div className="md:col-span-2">
                    <UploadImageInline textareaId={`content_md_${post.id}`} folder="posts" />
                  </div>
                  <textarea id={`content_md_${post.id}`} name="content_md" rows={8} required defaultValue={post.content_md} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none md:col-span-2" />
                  <div className="md:col-span-2 flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-100"
                    >
                      Guardar cambios
                    </button>
                  </div>
                </form>
              </div>
            </details>
          ))
        )}
      </section>
    </div>
  );
}

