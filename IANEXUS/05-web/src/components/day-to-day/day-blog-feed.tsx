"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import type { Post } from "@/lib/supabase/server";
import type { FilterState } from "./day-filter-bar";

function formatDate(dateString: string | null) {
  if (!dateString) return "Reciente";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "short",
  }).format(date);
}

function getKindLabel(kind: Post["post_kind"]) {
  switch (kind) {
    case "news":
      return "News";
    case "guide":
      return "Guide";
    case "tool":
      return "Tool";
    default:
      return "Blog";
  }
}

type DayBlogFeedProps = {
  posts: Post[];
  filters: FilterState;
};

export default function DayBlogFeed({ posts, filters }: DayBlogFeedProps) {
  const filteredPosts = posts.filter((post) => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        post.title.toLowerCase().includes(searchLower) ||
        (post.excerpt?.toLowerCase().includes(searchLower) ?? false) ||
        (post.ia_type?.toLowerCase().includes(searchLower) ?? false) ||
        post.post_kind.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    if (filters.category && post.ia_type !== filters.category) {
      return false;
    }

    return true;
  });

  if (filteredPosts.length === 0) {
    return (
      <div className="ui-empty rounded-[1rem] p-5 text-center">
        <Sparkles className="mx-auto mb-3 h-8 w-8 text-slate-300" />
        <p className="text-sm text-slate-500">No hay posts que coincidan con este filtro.</p>
        <p className="mt-1 text-xs text-slate-400">Prueba otra categoría, plan o término de búsqueda.</p>
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-end justify-between gap-3 px-1">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Posts</p>
          <h2 className="mt-1 text-xl font-semibold tracking-[-0.02em] text-slate-950">
            Lecturas y contexto
          </h2>
        </div>
        <span className="ui-chip rounded-full px-3 py-1 text-xs">
          {filteredPosts.length} resultados
        </span>
      </div>

      <div className="flex flex-col gap-3 md:gap-4">
        {filteredPosts.map((post) => {
          const kindLabel = getKindLabel(post.post_kind);
          const badgeClass =
            post.post_kind === "news"
              ? "border-amber-200 bg-amber-50 text-amber-700"
              : post.post_kind === "guide"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : post.post_kind === "tool"
                  ? "border-cyan-200 bg-cyan-50 text-cyan-700"
                  : "border-slate-200 bg-slate-50 text-slate-600";

          return (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              prefetch={true}
            className={`group overflow-hidden rounded-[0.95rem] border border-slate-300/70 bg-white shadow-[0_8px_18px_rgba(17,24,39,0.05)] transition duration-200 hover:-translate-y-0.5 hover:border-slate-400 md:rounded-[1rem] ${
                post.cover_image_url ? "grid gap-0 lg:grid-cols-[0.88fr_1.12fr]" : "p-4"
              }`}
            >
              {post.cover_image_url ? (
                <div className="relative min-h-[132px] overflow-hidden bg-slate-100 md:min-h-[160px] lg:min-h-full">
                  <Image
                    src={post.cover_image_url}
                    alt={post.title}
                    fill
                    unoptimized
                    loading="lazy"
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                </div>
              ) : null}

              <div className={`flex min-w-0 flex-1 flex-col gap-3 ${post.cover_image_url ? "p-3.5 md:p-4" : "p-3.5 md:p-4"}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className={`inline-flex rounded-full px-2 py-1 text-[10px] font-medium uppercase tracking-[0.14em] md:px-2.5 ${badgeClass}`}>
                          {kindLabel}
                        </span>
                      {post.ia_type ? (
                        <span className="ui-chip inline-flex rounded-full px-2 py-1 text-[10px] uppercase tracking-[0.14em] md:px-2.5">
                          {post.ia_type}
                        </span>
                      ) : null}
                    </div>
                    <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug tracking-[-0.02em] text-slate-950 group-hover:text-slate-700 md:text-[1.02rem]">
                      {post.title}
                    </h3>
                  </div>
                  <ArrowUpRight className="h-4 w-4 flex-shrink-0 text-slate-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>

                {post.excerpt ? (
                  <p className="line-clamp-2 text-[13px] leading-6 text-slate-600 md:text-sm">
                    {post.excerpt}
                  </p>
                ) : null}

                <div className="mt-auto flex items-center gap-2 pt-1">
                  <time className="text-[10px] text-slate-400 md:text-[11px]">{formatDate(post.published_at)}</time>
                  {post.post_kind === "news" ? (
                    <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] text-amber-700">
                      Update
                    </span>
                  ) : null}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
