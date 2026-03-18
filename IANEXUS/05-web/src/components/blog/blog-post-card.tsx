import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import type { Post } from "@/lib/supabase/server";
import { StaffEditButton } from "@/components/staff/staff-edit-button";

function formatDate(dateString: string | null) {
  if (!dateString) return "Reciente";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatLabel(kind: Post["post_kind"]) {
  switch (kind) {
    case "news":
      return "Actualizacion";
    case "guide":
      return "Guia";
    case "tool":
      return "Herramienta";
    default:
      return "Articulo";
  }
}

function kindTone(kind: Post["post_kind"]) {
  switch (kind) {
    case "news":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "guide":
      return "border-cyan-200 bg-cyan-50 text-cyan-800";
    case "tool":
      return "border-emerald-200 bg-emerald-50 text-emerald-800";
    default:
      return "border-slate-200 bg-slate-50 text-slate-700";
  }
}

export default function BlogPostCard({ post }: { post: Post }) {
  const isNews = post.post_kind === "news";

  return (
    <article className="group relative overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white shadow-[0_1px_0_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      <StaffEditButton
        href={`/admin/posts?q=${encodeURIComponent(post.slug)}`}
        label={`Editar post "${post.title}" en Admin`}
        className="absolute right-3 top-3 z-20"
      />

      <Link href={`/blog/${post.slug}`} prefetch={true} className="block h-full">
        {post.cover_image_url ? (
          <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
            <Image
              src={post.cover_image_url}
              alt={post.title}
              fill
              unoptimized
              loading="lazy"
              sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
              className="object-cover transition duration-500 group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent opacity-70" />
          </div>
        ) : (
          <div className="grid aspect-[16/10] place-items-center bg-[linear-gradient(135deg,rgba(241,245,249,0.95),rgba(255,255,255,0.85))]">
            <Sparkles className="h-10 w-10 text-slate-300" />
          </div>
        )}

        <div className="space-y-3.5 p-4 md:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <span
              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] ${kindTone(
                post.post_kind,
              )}`}
            >
              <Sparkles className="h-2.5 w-2.5" />
              {formatLabel(post.post_kind)}
            </span>
            <ArrowUpRight className="h-4 w-4 text-slate-400 transition group-hover:text-slate-700" />
          </div>

          <div className="space-y-2">
            <h2 className="text-[1.05rem] font-semibold leading-snug text-slate-950 md:text-xl">
              {post.title}
            </h2>

            {post.excerpt ? (
              <p className="line-clamp-2 text-sm leading-relaxed text-slate-600 md:text-[0.95rem]">
                {post.excerpt}
              </p>
            ) : (
              <p className="line-clamp-2 text-sm leading-relaxed text-slate-500 md:text-[0.95rem]">
                Una pieza curada para entender mejor el movimiento de la IA y tomar
                decisiones con mas contexto.
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <time>{formatDate(post.published_at)}</time>
              <span className="text-slate-300">/</span>
              <span>{post.ia_type || "IA"}</span>
            </div>

            <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-medium text-slate-600 transition group-hover:border-slate-300 group-hover:text-slate-800">
              Leer nota
            </span>
          </div>

          {isNews ? (
            <div className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-700">
              Update corto
            </div>
          ) : null}
        </div>
      </Link>
    </article>
  );
}
