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
    const postCategories = new Set(posts.map((p) => p.ia_type).filter((value): value is string => Boolean(value)));
    return Array.from(new Set([...toolCategories, ...postCategories])).sort();
  }, [posts, tools]);

  const leadPost = posts[0] ?? null;
  const leadTool = tools[0] ?? null;
  const feedPosts = posts.length > 1 ? posts.slice(1) : posts;
  const feedTools = tools.length > 1 ? tools.slice(1) : tools;

  return (
    <div className="flex flex-col gap-6">
      <DayFilterBar onFilterChange={setFilters} categories={categories} />

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="flex flex-col gap-6">
          {leadPost && (
            <div className="rounded-[20px] border border-slate-200/80 bg-white p-4 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Post principal</p>
              <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-slate-950">
                {leadPost.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {leadPost.excerpt ?? "Lectura principal del día, curada para arrancar el feed con contexto."}
              </p>
            </div>
          )}
          <DayBlogFeed posts={feedPosts} filters={filters} />
        </div>

        <div className="flex flex-col gap-6">
          {leadTool && (
            <div className="rounded-[20px] border border-slate-200/80 bg-white p-4 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Tool principal</p>
              <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-slate-950">
                {leadTool.name}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {leadTool.description ?? "Herramienta destacada para resolver una tarea concreta del día."}
              </p>
            </div>
          )}
          <DayToolsFeed tools={feedTools} filters={filters} />
        </div>
      </section>
    </div>
  );
}
