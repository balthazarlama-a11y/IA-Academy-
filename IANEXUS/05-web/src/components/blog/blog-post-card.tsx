import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import type { Post } from "@/lib/supabase/server";

function formatDate(dateString: string | null) {
  if (!dateString) return "Reciente";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default function BlogPostCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      prefetch={true}
      className="group block rounded-2xl border border-slate-200 bg-white p-5 transition-colors duration-150 hover:border-slate-200 hover:bg-white"
    >
      {/* Cover image - sin efectos hover que causen lag */}
      {post.cover_image_url ? (
        <div className="relative mb-4 h-32 w-full overflow-hidden rounded-xl">
          <Image
            src={post.cover_image_url}
            alt={post.title}
            fill
            unoptimized
            loading="lazy"
            sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover"
            style={{ opacity: 0.8 }}
          />
        </div>
      ) : null}

      <div className="flex flex-col">
        <div className="flex items-start justify-between gap-3">
          <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-slate-600">
            <Sparkles className="h-2.5 w-2.5" />
            Post
          </span>
          <ArrowUpRight className="h-4 w-4 text-slate-500" />
        </div>

        <h2 className="mt-3 text-lg font-medium leading-snug text-slate-900">
          {post.title}
        </h2>

        {post.excerpt ? (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">
            {post.excerpt}
          </p>
        ) : null}

        <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3">
          <time className="text-xs text-slate-500">{formatDate(post.published_at)}</time>
          {post.ia_type ? (
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] text-slate-600">
              {post.ia_type}
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}

