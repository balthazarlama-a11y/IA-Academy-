import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import type { Post } from "@/lib/supabase/server";

function formatDate(dateString: string | null) {
  if (!dateString) return "Reciente";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "short",
  }).format(date);
}

export default function LatestUpdatesSection({
  posts,
  title = "Ultimas actualizaciones IA",
  subtitle = "Cambios, lanzamientos y novedades cortas para enterarte rapido.",
}: {
  posts: Post[];
  title?: string;
  subtitle?: string;
}) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-amber-700">
            <Sparkles className="h-3.5 w-3.5" />
            Last Updates
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-900 md:text-3xl">
            {title}
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-600 md:text-base">
            {subtitle}
          </p>
        </div>

        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 transition hover:text-slate-900"
        >
          Ver todas las novedades
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group rounded-2xl border border-slate-200 bg-slate-50/60 p-4 transition-colors hover:border-slate-300 hover:bg-white"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-amber-700">
                News
              </span>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:text-slate-700" />
            </div>

            <h3 className="mt-3 line-clamp-2 text-base font-semibold leading-snug text-slate-900">
              {post.title}
            </h3>

            {post.excerpt ? (
              <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600">
                {post.excerpt}
              </p>
            ) : (
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                Actualizacion corta sobre herramientas, lanzamientos y movimientos clave de IA.
              </p>
            )}

            <div className="mt-4 flex items-center gap-2 border-t border-slate-200 pt-3 text-[11px] text-slate-500">
              <time>{formatDate(post.published_at)}</time>
              {post.ia_type ? (
                <>
                  <span className="text-slate-300">/</span>
                  <span>{post.ia_type}</span>
                </>
              ) : null}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
