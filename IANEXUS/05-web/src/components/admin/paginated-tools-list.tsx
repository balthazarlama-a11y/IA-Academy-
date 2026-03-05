"use client";

import { useState, useMemo } from "react";
import { PaginationControls } from "./pagination-controls";
import { ToolEditorItem } from "./tool-editor-item";

type Tool = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  url: string;
  cover_image_url: string | null;
  plan: "free" | "freemium" | "paid" | "edu_free";
  level: "beginner" | "intermediate" | "advanced" | "all";
  ia_type: string | null;
  category_id: string;
  verified: boolean;
  edu_verified: boolean;
  featured: boolean;
  status: "draft" | "scheduled" | "published" | "archived";
  sort_order: number;
  updated_at: string;
  tool_categories: { name: string; slug: string } | { name: string; slug: string }[] | null;
};

type ToolCategory = {
  id: string;
  name: string;
  slug: string;
};

type ActionFn = (formData: FormData) => Promise<void>;

const ITEMS_PER_PAGE = 25;

interface PaginatedToolsListProps {
  tools: Tool[];
  categories: ToolCategory[];
  updateAction: ActionFn;
  deleteAction: ActionFn;
}

export function PaginatedToolsList({
  tools,
  categories,
  updateAction,
  deleteAction,
}: PaginatedToolsListProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(tools.length / ITEMS_PER_PAGE);

  const paginatedTools = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return tools.slice(start, start + ITEMS_PER_PAGE);
  }, [tools, currentPage]);

  if (tools.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
        No hay tools todavía.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={tools.length}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
      />

      <div className="space-y-3">
        {paginatedTools.map((tool) => (
          <ToolEditorItem
            key={tool.id}
            tool={tool}
            categories={categories}
            updateAction={updateAction}
            deleteAction={deleteAction}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={tools.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
