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

type DayBlogFeedProps = {
  posts: Post[];
  filters: FilterState;
};

export default function DayBlogFeed({ posts, filters }: DayBlogFeedProps) {
  const filteredPosts = posts.filter((post) => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        post.title.toLowerCase().includes(searchLower) ||
        (post.excerpt?.toLowerCase().includes(searchLower) ?? false) ||
        (post.ia_type?.toLowerCase().includes(searchLower) ?? false);
      if (!matchesSearch) return false;
    }

    // Category filter (for posts, we use ia_type as category)
    if (filters.category && post.ia_type !== filters.category) {
      return false;
    }

    return true;
  });

  if (filteredPosts.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
        <Sparkles className="mx-auto h-8 w-8 text-white/20 mb-3" />
        <p className="text-sm text-white/50">No se encontraron posts</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-sm font-medium uppercase tracking-[0.12em] text-white/50 px-1">
        Posts ({filteredPosts.length})
      </h2>

      <div className="flex flex-col gap-4">
        {filteredPosts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            prefetch={true}
            className="group flex gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition-colors duration-150 hover:border-white/20 hover:bg-white/[0.06]"
          >
            {/* Thumbnail */}
            {post.cover_image_url ? (
              <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl">
                <Image
                  src={post.cover_image_url}
                  alt={post.title}
                  fill
                  unoptimized
                  loading="lazy"
                  className="object-cover opacity-80"
                />
              </div>
            ) : (
              <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05]">
                <Sparkles className="h-6 w-6 text-white/20" />
              </div>
            )}

            {/* Content */}
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-start justify-between gap-2">
                <h3 className="line-clamp-2 text-sm font-medium leading-snug text-white">
                  {post.title}
                </h3>
                <ArrowUpRight className="h-4 w-4 flex-shrink-0 text-white/30" />
              </div>

              {post.excerpt && (
                <p className="mt-1 line-clamp-2 text-xs text-white/50">
                  {post.excerpt}
                </p>
              )}

              <div className="mt-auto flex items-center gap-2 pt-2">
                <time className="text-[10px] text-white/35">
                  {formatDate(post.published_at)}
                </time>
                {post.ia_type && (
                  <span className="rounded-full border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-white/50">
                    {post.ia_type}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
