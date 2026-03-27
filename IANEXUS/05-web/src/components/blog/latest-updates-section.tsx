import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
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
  title = "Actualizaciones recientes",
  subtitle = "Notas cortas para ponerse al día y volver rápido al archivo.",
}: {
  posts: Post[];
  title?: string;
  subtitle?: string;
}) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="overflow-hidden rounded-[1.35rem] ui-shell">
      <div className="grid gap-px border-transparent ui-rule lg:grid-cols-[0.9fr_1.1fr]">
        <div className="bg-[linear-gradient(180deg,rgba(247,243,236,0.8)_0%,rgba(255,255,255,0.95)_100%)] p-4 md:p-5">
          <p className="ui-label">Ahora</p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950 md:text-2xl">
            {title}
          </h2>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-slate-600">{subtitle}</p>

          <Link
            href="/blog"
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-slate-300/70 bg-white px-4 py-2 text-sm font-medium text-slate-800 transition hover:border-slate-400 hover:bg-slate-50"
          >
            Ver archivo completo
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-px border-transparent ui-rule md:grid-cols-3">
          {posts.map((post, index) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group bg-white p-4 transition hover:bg-slate-50"
            >
              <div className="flex items-center justify-between gap-3 text-[11px] uppercase tracking-[0.16em] text-slate-500">
                <span>{formatDate(post.published_at)}</span>
                <span>{String(index + 1).padStart(2, "0")}</span>
              </div>

              <h3 className="mt-3 line-clamp-2 text-sm font-semibold leading-snug text-slate-950">
                {post.title}
              </h3>

              {post.subtitle ? (
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-500">
                  {post.subtitle}
                </p>
              ) : null}

              <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600">
                {post.excerpt || "Una nota breve para entrar en contexto sin perder tiempo."}
              </p>

              {post.ia_type ? (
                <p className="mt-4 border-t border-slate-200 pt-2 text-[11px] text-slate-500">
                  {post.ia_type}
                </p>
              ) : null}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
