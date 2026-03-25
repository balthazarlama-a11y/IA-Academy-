"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PaginationControls } from "./pagination-controls";
import type { PostDetail, PostStatus, PostSummary } from "@/lib/types/post";

type Post = PostSummary & {
  content_md: string;
  content_json: PostDetail["content_json"];
  status: PostStatus;
  updated_at: string;
};

const ITEMS_PER_PAGE = 25;

interface PaginatedPostsListProps {
  posts: Post[];
  emptyMessage?: string;
}

export function PaginatedPostsList({
  posts,
  emptyMessage = "No hay posts todavía.",
}: PaginatedPostsListProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(posts.length / ITEMS_PER_PAGE);

  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return posts.slice(start, start + ITEMS_PER_PAGE);
  }, [posts, currentPage]);

  if (posts.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={posts.length}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
      />

      <div className="grid gap-3">
        {paginatedPosts.map((post) => (
          <article
            key={post.id}
            className="rounded-[1.6rem] border border-slate-200 bg-white px-5 py-4 shadow-[0_16px_36px_rgba(15,23,42,0.04)]"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    {post.post_kind}
                  </span>
                  <span className="inline-flex rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    {post.status}
                  </span>
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-semibold tracking-tight text-slate-950">{post.title}</h4>
                  {post.subtitle ? (
                    <p className="text-sm text-slate-600">{post.subtitle}</p>
                  ) : null}
                </div>
                {post.excerpt ? (
                  <p className="line-clamp-2 max-w-3xl text-sm leading-7 text-slate-500">{post.excerpt}</p>
                ) : null}
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                  /{post.slug} · actualizado {new Intl.DateTimeFormat("es-CL", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }).format(new Date(post.updated_at))}
                </p>
              </div>

              <div className="flex shrink-0 flex-wrap gap-2">
                <Link
                  href={`/admin/posts/${post.id}/edit`}
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  Abrir editor
                </Link>
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Ver público
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={posts.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
