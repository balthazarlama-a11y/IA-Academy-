import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/session";
import { getSupabaseServerAuthClient } from "@/lib/supabase/server";
import { CreatePostForm } from "@/components/admin/create-post-form";
import { PaginatedPostsList } from "@/components/admin/paginated-posts-list";
import { createPostAction, updatePostAction, deletePostAction } from "./actions";

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
  searchParams: Promise<{ ok?: string; err?: string; q?: string }>;
}) {
  await ensureStaffUser();
  const supabase = await getSupabaseServerAuthClient();

  const params = await searchParams;
  const successMessage = params.ok ?? "";
  const errorMessage = params.err ?? "";
  const query = (params.q ?? "").trim().toLowerCase();

  const { data } = await supabase
    .from("posts")
    .select("id, title, slug, excerpt, content_md, cover_image_url, post_kind, ia_type, status, published_at, updated_at")
    .order("updated_at", { ascending: false })
    .limit(500);

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

      {!query ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="mb-4 text-lg font-medium text-slate-900">Nuevo post</h3>
          <CreatePostForm createAction={createPostAction} />
        </section>
      ) : null}

      <section className="space-y-3">
        <h3 className="text-lg font-medium text-slate-900">Posts existentes ({posts.length})</h3>
        <PaginatedPostsList posts={posts} updateAction={updatePostAction} deleteAction={deletePostAction} openSlug={query} />
      </section>
    </div>
  );
}
