"use client";

import { useMemo, useState } from "react";
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

  const categories = useMemo(() => {
    const toolCategories = new Set(tools.map((t) => t.category.name));
    const postCategories = new Set(
      posts.map((p) => p.ia_type).filter((value): value is string => Boolean(value)),
    );
    return Array.from(new Set([...toolCategories, ...postCategories])).sort();
  }, [posts, tools]);

  return (
    <div className="flex flex-col gap-5">
      <DayFilterBar onFilterChange={setFilters} categories={categories} />

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-[1.02fr_0.98fr]">
        <DayBlogFeed posts={posts} filters={filters} />
        <DayToolsFeed tools={tools} filters={filters} />
      </section>
    </div>
  );
}
