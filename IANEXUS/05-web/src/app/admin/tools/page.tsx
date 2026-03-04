import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/session";
import { getSupabaseServerAuthClient } from "@/lib/supabase/server";
import { CreateToolForm } from "@/components/admin/create-tool-form";
import { ToolEditorItem } from "@/components/admin/tool-editor-item";
import { createToolAction, updateToolAction } from "./actions";

export const metadata = {
  title: "Tools - Admin IA NEXUS",
};

type AdminToolRow = {
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

async function ensureStaffUser() {
  const user = await getCurrentUser();
  const role = user?.role ?? null;

  if (!user || (role !== "admin" && role !== "master")) {
    throw new Error("No autorizado");
  }

  return user;
}

export default async function AdminToolsPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; err?: string }>;
}) {
  await ensureStaffUser();
  const supabase = await getSupabaseServerAuthClient();

  const params = await searchParams;
  const successMessage = params.ok ?? "";
  const errorMessage = params.err ?? "";

  const [{ data: toolsData }, { data: categoriesData }] = await Promise.all([
    supabase
      .from("tools")
      .select("id, name, slug, description, url, cover_image_url, plan, level, ia_type, category_id, verified, edu_verified, featured, status, sort_order, updated_at, tool_categories(name, slug)")
      .order("updated_at", { ascending: false })
      .limit(100),
    supabase
      .from("tool_categories")
      .select("id, name, slug")
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true }),
  ]);

  const tools = ((toolsData ?? []) as unknown as AdminToolRow[]);
  const categories = ((categoriesData ?? []) as ToolCategory[]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Tools</h2>
          <p className="text-sm text-slate-500">Gestiona herramientas publicadas y borradores.</p>
        </div>
        <Link
          href="/admin/posts"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 transition hover:bg-slate-50"
        >
          Ir a Posts
        </Link>
      </div>

      {successMessage ? (
        <div className="rounded-xl border border-emerald-300/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-700">
          {successMessage}
        </div>
      ) : null}

      {errorMessage ? (
        <div className="rounded-xl border border-red-300/30 bg-red-400/10 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      <section
        className="rounded-2xl p-5"
        style={{ background: "rgba(255, 255, 255, 0.88)", border: "1px solid rgba(148, 163, 184, 0.32)" }}
      >
        <h3 className="mb-4 text-lg font-medium text-slate-900">Nueva tool</h3>
        <CreateToolForm categories={categories} createAction={createToolAction} />
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-medium text-slate-900">Tools existentes ({tools.length})</h3>

        {tools.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
            No hay tools todavía.
          </div>
        ) : (
          <div className="space-y-3">
            {tools.map((tool) => (
              <ToolEditorItem
                key={tool.id}
                tool={tool}
                categories={categories}
                updateAction={updateToolAction}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
