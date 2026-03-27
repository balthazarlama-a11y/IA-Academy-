import Link from "next/link";
import { getSupabaseServerAuthClient } from "@/lib/supabase/server";
import type { PostDetail, PostStatus, PostSummary } from "@/lib/types/post";
import { PaginatedPostsList } from "@/components/admin/paginated-posts-list";

export const metadata = {
  title: "Posts - Admin YourAI",
};

type AdminPostRow = PostSummary & {
  content_md: string;
  content_json: PostDetail["content_json"];
  status: PostStatus;
  updated_at: string;
};

export default async function AdminPostsPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; err?: string; q?: string }>;
}) {
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
  const newsCount = posts.filter((post) => post.post_kind === "news").length;

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.08),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,249,252,0.95))] p-6 shadow-[0_22px_52px_rgba(15,23,42,0.05)]">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex rounded-full border border-[#3351c8]/15 bg-[#3351c8]/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#3351c8]">
                Editorial archive
              </span>
              {[
                { label: "Total", value: totalPosts },
                { label: "Publicados", value: publishedPosts },
                { label: "Borradores", value: draftPosts },
                { label: "News", value: newsCount },
              ].map((stat) => (
                <span
                  key={stat.label}
                  className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500"
                >
                  {stat.label}: {stat.value}
                </span>
              ))}
            </div>

            <div className="max-w-4xl space-y-3">
              <h1 className="font-[var(--font-display)] text-4xl leading-[0.95] tracking-tight text-slate-950 md:text-5xl">
                Archivo de posts
              </h1>
              <p className="max-w-3xl text-[0.98rem] leading-8 text-slate-600">
                Desde aquí revisas el archivo, filtras el contenido y abres el espacio de escritura dedicado. La edición ya no compite con el listado.
              </p>
            </div>
          </div>

          <aside className="space-y-4">
            <section className="rounded-[1.8rem] border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.04)]">
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#3351c8]">
                Nuevo espacio
              </p>
              <h3 className="mt-2 text-lg font-semibold text-slate-950">Escribir como documento</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                El editor ahora vive en una página dedicada, con canvas ancho y panel lateral para publicación.
              </p>
              <Link
                href="/admin/posts/new"
                className="mt-4 inline-flex w-full items-center justify-center rounded-full border border-slate-200 bg-slate-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                Crear post
              </Link>
            </section>

            <section className="rounded-[1.8rem] border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.04)]">
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500">Buscar</p>
              <form method="get" className="mt-4 space-y-3">
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    ⌕
                  </span>
                  <input
                    name="q"
                    defaultValue={query}
                    placeholder="Titulo, slug, tipo o estado"
                    className="w-full rounded-full border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="inline-flex flex-1 items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    Filtrar
                  </button>
                  {query ? (
                    <Link
                      href="/admin/posts"
                      className="inline-flex flex-1 items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                    >
                      Limpiar
                    </Link>
                  ) : null}
                </div>
              </form>
            </section>
          </aside>
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_20px_48px_rgba(15,23,42,0.04)]">
        {successMessage ? (
          <div className="mb-4 rounded-xl border border-emerald-300/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-700">
            {successMessage}
          </div>
        ) : null}

        {errorMessage ? (
          <div className="mb-4 rounded-xl border border-red-300/30 bg-red-400/10 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        ) : null}

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
              {query ? `Resultados para “${query}”` : "Abre una pieza para editarla en un workspace completo"}
            </p>
          </div>
          <PaginatedPostsList
            key={`${query || "all"}-${filteredPosts.length}-${totalPosts}`}
            posts={filteredPosts}
            emptyMessage={query ? "No hay posts que coincidan con esta búsqueda." : "No hay posts todavía."}
          />
        </section>
      </section>
    </div>
  );
}

