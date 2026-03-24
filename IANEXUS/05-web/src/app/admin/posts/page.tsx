import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/session";
import { getSupabaseServerAuthClient } from "@/lib/supabase/server";
import type { PostDetail, PostStatus, PostSummary } from "@/lib/types/post";
import { CreatePostForm } from "@/components/admin/create-post-form";
import { PaginatedPostsList } from "@/components/admin/paginated-posts-list";
import { createPostAction, updatePostAction, deletePostAction } from "./actions";

export const metadata = {
  title: "Posts - Admin IA NEXUS",
};

type AdminPostRow = PostSummary & {
  content_md: string;
  content_json: PostDetail["content_json"];
  status: PostStatus;
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
    .select(
      "id, title, subtitle, slug, excerpt, content_md, content_json, cover_image_url, hero_image_alt, hero_image_caption, post_kind, ia_type, status, published_at, updated_at",
    )
    .order("updated_at", { ascending: false })
    .limit(500);

  const posts = (data ?? []) as AdminPostRow[];
  const filteredPosts = query
    ? posts.filter((post) => {
        const haystack = [
          post.title,
          post.subtitle ?? "",
          post.slug,
          post.excerpt ?? "",
          post.ia_type ?? "",
          post.post_kind,
          post.status,
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(query);
      })
    : posts;

  const totalPosts = posts.length;
  const publishedPosts = posts.filter((post) => post.status === "published").length;
  const draftPosts = posts.filter((post) => post.status === "draft").length;
  const scheduledPosts = posts.filter((post) => post.status === "scheduled").length;
  const newsCount = posts.filter((post) => post.post_kind === "news").length;
  const publishedNewsCount = posts.filter(
    (post) => post.post_kind === "news" && post.status === "published",
  ).length;

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.94))] p-6 shadow-[0_20px_60px_rgba(15,23,42,0.05)]">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(290px,320px)] xl:items-start">
          <div className="space-y-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#3351c8]">
                  Editorial control room
                </p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
                  Posts
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 md:text-[0.98rem]">
                  Escribe, ordena y publica artículos por bloques. Mantén la portada editorial limpia,
                  el archivo buscable y la composición lista para lectura larga.
                </p>
              </div>

              <form method="get" className="flex w-full max-w-xl flex-col gap-3 sm:flex-row lg:w-[31rem]">
                <div className="relative flex-1">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    ⌕
                  </span>
                  <input
                    name="q"
                    defaultValue={query}
                    placeholder="Buscar por título, slug, subtítulo, estado o tipo"
                    className="w-full rounded-full border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  Buscar
                </button>
                {query ? (
                  <Link
                    href="/admin/posts"
                    className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    Limpiar
                  </Link>
                ) : null}
              </form>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { label: "Total", value: totalPosts, hint: "posts en archivo" },
                { label: "Publicados", value: publishedPosts, hint: "visibles en frontend" },
                { label: "Borradores", value: draftPosts, hint: "todavía en edición" },
                { label: "News", value: newsCount, hint: `${publishedNewsCount} publicadas` },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-4 shadow-[0_10px_22px_rgba(15,23,42,0.03)]"
                >
                  <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
                    {item.label}
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950 tabular-nums">
                    {item.value}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">{item.hint}</p>
                </div>
              ))}
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
          </div>

          <aside className="space-y-4 xl:sticky xl:top-6 xl:self-start">
            <section className="rounded-[2rem] border border-slate-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,250,252,0.96))] p-5 shadow-[0_18px_44px_rgba(15,23,42,0.04)]">
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#3351c8]">
                Guía rápida
              </p>
              <h4 className="mt-2 text-base font-semibold text-slate-950">Orden recomendado</h4>
              <ol className="mt-4 space-y-3 text-sm leading-relaxed text-slate-600">
                <li>
                  <span className="font-medium text-slate-900">1.</span> Escribe título, subtítulo y
                  portada.
                </li>
                <li>
                  <span className="font-medium text-slate-900">2.</span> Construye el cuerpo por
                  bloques y revisa el preview.
                </li>
                <li>
                  <span className="font-medium text-slate-900">3.</span> Publica con estado visible
                  y fecha correcta.
                </li>
              </ol>
            </section>

            <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_18px_44px_rgba(15,23,42,0.04)]">
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500">
                Estado del archivo
              </p>
              <div className="mt-4 grid gap-3">
                {[
                  { label: "Total posts", value: totalPosts },
                  { label: "Publicados", value: publishedPosts },
                  { label: "Borradores", value: draftPosts },
                  { label: "Scheduled", value: scheduledPosts },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
                  >
                    <span className="text-sm text-slate-500">{item.label}</span>
                    <span className="text-lg font-semibold text-slate-950 tabular-nums">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <Link
              href="/admin/tools"
              className="flex items-center justify-between rounded-[1.6rem] border border-slate-200 bg-slate-950 px-5 py-4 text-white shadow-[0_18px_44px_rgba(15,23,42,0.08)] transition hover:bg-slate-800"
            >
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/60">
                  Siguiente superficie
                </p>
                <p className="mt-1 text-sm font-medium">Ir a Tools</p>
              </div>
              <span className="text-lg leading-none">→</span>
            </Link>
          </aside>
        </div>
      </section>

      <div className="space-y-6">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_18px_44px_rgba(15,23,42,0.04)]">
          <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500">
                Nuevo post
              </p>
              <h3 className="text-lg font-semibold text-slate-950">Componer pieza editorial</h3>
            </div>
            <p className="text-xs text-slate-500">
              {newsCount} news · {publishedNewsCount} publicadas · {scheduledPosts} agendadas
            </p>
          </div>
          <CreatePostForm createAction={createPostAction} />
        </section>

        <section className="space-y-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500">
                Archivo editorial
              </p>
              <h3 className="text-lg font-semibold text-slate-950">
                Posts existentes ({filteredPosts.length}
                {query ? ` de ${totalPosts}` : ""})
              </h3>
            </div>
            <p className="text-sm text-slate-500">
              {query ? `Resultados para “${query}”` : "Ordenados por actualización más reciente"}
            </p>
          </div>
          <PaginatedPostsList
            key={`${query || "all"}-${filteredPosts.length}-${totalPosts}`}
            posts={filteredPosts}
            updateAction={updatePostAction}
            deleteAction={deletePostAction}
            openSlug={query}
            emptyMessage={
              query ? "No hay posts que coincidan con esta búsqueda." : "No hay posts todavía."
            }
          />
        </section>
      </div>
    </div>
  );
}
