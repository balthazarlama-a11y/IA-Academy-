import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
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
      return "Actualización";
    case "guide":
      return "Guía";
    case "tool":
      return "Herramienta";
    default:
      return "Artículo";
  }
}

type BlogPostCardProps = {
  post: Post;
  compact?: boolean;
};

export default function BlogPostCard({ post, compact = false }: BlogPostCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_1px_0_rgba(15,23,42,0.04)] transition duration-200 hover:border-slate-300 hover:shadow-[0_14px_32px_rgba(15,23,42,0.06)]">
      <StaffEditButton
        href={`/admin/posts?q=${encodeURIComponent(post.slug)}`}
        label={`Editar post "${post.title}" en Admin`}
        className="absolute right-3 top-3 z-20"
      />

      <Link href={`/blog/${post.slug}`} prefetch={true} className="block h-full">
        {post.cover_image_url ? (
          <div className={`relative overflow-hidden bg-slate-100 ${compact ? "aspect-[16/9]" : "aspect-[16/10]"}`}>
            <Image
              src={post.cover_image_url}
              alt={post.title}
              fill
              unoptimized
              loading="lazy"
              sizes={compact ? "(min-width: 1024px) 45vw, 100vw" : "(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"}
              className="object-cover transition duration-500 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/18 via-transparent to-transparent" />
          </div>
        ) : null}

        <div className={`space-y-3 ${compact ? "p-4 md:p-5" : "p-4"}`}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 space-y-1">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
                {formatLabel(post.post_kind)}
              </p>
              <h2 className={`font-semibold leading-snug text-slate-950 ${compact ? "text-xl md:text-2xl" : "text-[1rem] md:text-[1.05rem]"}`}>
                {post.title}
              </h2>
              {post.subtitle ? (
                <p className={`text-slate-500 ${compact ? "text-sm md:text-[0.95rem]" : "text-sm"}`}>
                  {post.subtitle}
                </p>
              ) : null}
            </div>
            <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-slate-400 transition group-hover:text-slate-700" />
          </div>

          <p className={`leading-relaxed text-slate-600 ${compact ? "line-clamp-3 text-sm md:text-base" : "line-clamp-2 text-sm"}`}>
            {post.excerpt ||
              "Una lectura curada para entender mejor el movimiento de la IA y decidir con más contexto."}
          </p>

          <div className="flex flex-wrap items-center gap-2 border-t border-slate-200 pt-3 text-xs text-slate-500">
            <time>{formatDate(post.published_at)}</time>
            {post.ia_type ? (
              <>
                <span className="text-slate-300">/</span>
                <span>{post.ia_type}</span>
              </>
            ) : null}
          </div>
        </div>
      </Link>
    </article>
  );
}
