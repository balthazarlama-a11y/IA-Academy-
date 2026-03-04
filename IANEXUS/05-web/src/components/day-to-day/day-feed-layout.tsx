"use client";

import { useState, useMemo } from "react";
import type { Post } from "@/lib/supabase/server";
import type { Tool } from "@/lib/repositories/tools-repo";
import DayFilterBar, { type FilterState } from "./day-filter-bar";
import DayBlogFeed from "./day-blog-feed";
import DayToolsFeed from "./day-tools-feed";

type DayFeedLayoutProps = {
  posts: Post[];
  tools: Tool[];
};

export default function DayFeedLayout({ posts, tools }: DayFeedLayoutProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    plan: "all",
    category: "",
    level: "all",
  });

  // Extract unique categories from both posts and tools
  const categories = useMemo(() => {
    const toolCategories = new Set(tools.map((t) => t.category.name));
    const postCategories = new Set(posts.map((p) => p.ia_type).filter((t): t is string => Boolean(t)));
    return Array.from(new Set([...toolCategories, ...postCategories])).sort();
  }, [posts, tools]);

  return (
    <div className="flex flex-col gap-6">
      {/* Shared filter bar */}
      <DayFilterBar onFilterChange={setFilters} categories={categories} />

      {/* Two column layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left column: Blogs */}
        <div className="flex flex-col">
          <DayBlogFeed posts={posts} filters={filters} />
        </div>

        {/* Right column: Tools */}
        <div className="flex flex-col">
          <DayToolsFeed tools={tools} filters={filters} />
        </div>
      </div>
    </div>
  );
}
