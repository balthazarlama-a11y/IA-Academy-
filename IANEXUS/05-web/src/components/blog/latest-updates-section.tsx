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
  subtitle = "Cambios, lanzamientos y notas cortas para entrar rapido en contexto.",
}: {
  posts: Post[];
  title?: string;
  subtitle?: string;
}) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-white/80 bg-white/92 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
      <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
        <div className="border-b border-slate-200/80 p-4 md:p-5 lg:border-b-0 lg:border-r">
          <p className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-amber-700">
            <Sparkles className="h-3.5 w-3.5" />
            Ultima hora
          </p>

          <h2 className="mt-4 text-xl font-semibold tracking-tight text-slate-950 md:text-2xl">
            {title}
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600">
            {subtitle}
          </p>

          <div className="mt-5 space-y-2.5 text-sm text-slate-600">
            <p className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              Cambios de producto y lanzamientos
            </p>
            <p className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-cyan-400" />
              Lectura corta para contexto rapido
            </p>
            <p className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-slate-400" />
              Archivo editorial actualizado
            </p>
          </div>

          <Link
            href="/blog"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
          >
            Ver archivo completo
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-px bg-slate-200 md:grid-cols-3">
          {posts.map((post, index) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group bg-white p-3.5 transition duration-200 hover:bg-slate-50"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500">
                  <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-amber-700">
                    #{index + 1}
                  </span>
                  <span>{formatDate(post.published_at)}</span>
                </div>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:text-slate-700" />
              </div>

              <h3 className="mt-3.5 line-clamp-2 text-sm font-semibold leading-snug text-slate-950">
                {post.title}
              </h3>

              {post.excerpt ? (
              <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-slate-600">
                  {post.excerpt}
                </p>
              ) : (
                <p className="mt-3 text-sm leading-relaxed text-slate-500">
                  Una nota breve para leer en pocos minutos y salir con contexto.
                </p>
              )}

              <div className="mt-4 flex items-center gap-2 border-t border-slate-200 pt-2.5 text-[11px] text-slate-500">
                <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2.5 py-1 text-slate-700">
                  Actualizacion
                </span>
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
      </div>
    </section>
  );
}
