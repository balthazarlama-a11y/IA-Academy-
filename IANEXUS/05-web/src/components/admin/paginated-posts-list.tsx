"use client";

import { useState, useMemo } from "react";
import { PaginationControls } from "./pagination-controls";
import { PostEditorItem } from "./post-editor-item";

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content_md: string;
  cover_image_url: string | null;
  post_kind: "blog" | "tool" | "guide" | "news";
  ia_type: string | null;
  status: "draft" | "scheduled" | "published" | "archived";
  published_at: string | null;
  updated_at: string;
};

type ActionFn = (formData: FormData) => Promise<void>;

const ITEMS_PER_PAGE = 25;

interface PaginatedPostsListProps {
  posts: Post[];
  updateAction: ActionFn;
  deleteAction: ActionFn;
}

export function PaginatedPostsList({
  posts,
  updateAction,
  deleteAction,
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
        No hay posts todavía.
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

      <div className="space-y-3">
        {paginatedPosts.map((post) => (
          <PostEditorItem
            key={post.id}
            post={post}
            updateAction={updateAction}
            deleteAction={deleteAction}
          />
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
