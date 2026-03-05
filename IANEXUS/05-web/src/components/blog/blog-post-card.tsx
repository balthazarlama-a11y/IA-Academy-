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

export default function BlogPostCard({ post }: { post: Post }) {
  const isNews = post.post_kind === "news";

  return (
    <article className="group relative rounded-2xl border border-slate-200 bg-white transition-colors duration-150 hover:border-slate-200 hover:bg-white">
      <StaffEditButton
        href={`/admin/posts?q=${encodeURIComponent(post.slug)}`}
        label={`Editar post "${post.title}" en Admin`}
        className="absolute right-3 top-3 z-10"
      />
      <Link
        href={`/blog/${post.slug}`}
        prefetch={true}
        className="block p-5"
      >
        {/* Cover image */}
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
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] ${
                isNews
                  ? "border border-amber-200 bg-amber-50 text-amber-700"
                  : "border border-slate-200 bg-white text-slate-600"
              }`}
            >
              <Sparkles className="h-2.5 w-2.5" />
              {isNews ? "News" : "Post"}
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
            <div className="flex items-center gap-2">
              <time className="text-xs text-slate-500">{formatDate(post.published_at)}</time>
              {isNews ? (
                <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] text-amber-700">
                  Update corto
                </span>
              ) : null}
            </div>
            {post.ia_type ? (
              <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] text-slate-600">
                {post.ia_type}
              </span>
            ) : null}
          </div>
        </div>
      </Link>
    </article>
  );
}

