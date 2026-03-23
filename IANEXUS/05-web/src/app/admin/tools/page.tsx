import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/session";
import { getSupabaseServerAuthClient } from "@/lib/supabase/server";
import { CreateToolForm } from "@/components/admin/create-tool-form";
import { ToolEditorItem } from "@/components/admin/tool-editor-item";
import { createToolAction, updateToolAction, deleteToolAction } from "./actions";

export const metadata = {
  title: "Tools - Admin IA NEXUS",
};

type AdminTaxonomy = {
  id: string;
  name: string;
  slug: string;
};

type AreaRelationEntry = {
  sort_order: number;
  areas: AdminTaxonomy | AdminTaxonomy[] | null;
};

type UseCaseRelationEntry = {
  sort_order: number;
  use_cases: AdminTaxonomy | AdminTaxonomy[] | null;
};

type AdminToolRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  tagline: string | null;
  company_name: string | null;
  url: string;
  cover_image_url: string | null;
  screenshot_url: string | null;
  demo_video_url: string | null;
  platform_tags: string[] | null;
  language_codes: string[] | null;
  spanish_available: boolean;
  feature_bullets: string[] | null;
  faq_items: Array<{ question: string; answer: string }> | null;
  plan: "free" | "freemium" | "paid" | "edu_free";
  level: "beginner" | "intermediate" | "advanced" | "all";
  ia_type: string | null;
  verified: boolean;
  edu_verified: boolean;
  featured: boolean;
  status: "draft" | "scheduled" | "published" | "archived";
  sort_order: number;
  updated_at: string;
  tool_areas: AreaRelationEntry[] | null;
  tool_use_cases: UseCaseRelationEntry[] | null;
};

async function ensureStaffUser() {
  const user = await getCurrentUser();
  const role = user?.role ?? null;
  if (!user || (role !== "admin" && role !== "master")) {
    throw new Error("No autorizado");
  }
  return user;
}

export default async function AdminToolsPage({ searchParams }: { searchParams: Promise<{ ok?: string; err?: string; q?: string }> }) {
  await ensureStaffUser();
  const supabase = await getSupabaseServerAuthClient();

  const params = await searchParams;
  const successMessage = params.ok ?? "";
  const errorMessage = params.err ?? "";
  const query = (params.q ?? "").trim().toLowerCase();

  const [{ data: toolsData }, { data: areasData }, { data: useCasesData }] = await Promise.all([
    supabase
      .from("tools")
      .select("id, name, slug, description, tagline, company_name, url, cover_image_url, screenshot_url, demo_video_url, platform_tags, language_codes, spanish_available, feature_bullets, faq_items, plan, level, ia_type, verified, edu_verified, featured, status, sort_order, updated_at, tool_areas(sort_order, areas(id, name, slug)), tool_use_cases(sort_order, use_cases(id, name, slug))")
      .order("updated_at", { ascending: false })
      .limit(100),
    supabase.from("areas").select("id, name, slug").eq("status", "published").order("sort_order", { ascending: true }).order("name", { ascending: true }),
    supabase.from("use_cases").select("id, name, slug").eq("status", "published").order("sort_order", { ascending: true }).order("name", { ascending: true }),
  ]);

  const tools = (toolsData ?? []) as unknown as AdminToolRow[];
  const areas = (areasData ?? []) as AdminTaxonomy[];
  const useCases = (useCasesData ?? []) as AdminTaxonomy[];
  const filteredTools = query
    ? tools.filter((tool) => [tool.name, tool.slug, tool.url, tool.company_name ?? ""].some((value) => value.toLowerCase().includes(query)))
    : tools;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Tools</h2>
          <p className="text-sm text-slate-500">Gestiona herramientas con áreas, casos de uso y campos editoriales enriquecidos.</p>
        </div>
        <Link href="/admin/posts" className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 transition hover:bg-slate-50">
          Ir a Posts
        </Link>
      </div>

      {successMessage ? <div className="rounded-xl border border-emerald-300/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-700">{successMessage}</div> : null}
      {errorMessage ? <div className="rounded-xl border border-red-300/30 bg-red-400/10 px-4 py-3 text-sm text-red-700">{errorMessage}</div> : null}

      {!query ? (
        <section className="rounded-2xl p-5" style={{ background: "rgba(255, 255, 255, 0.88)", border: "1px solid rgba(148, 163, 184, 0.32)" }}>
          <h3 className="mb-4 text-lg font-medium text-slate-900">Nueva tool</h3>
          <CreateToolForm areas={areas} useCases={useCases} createAction={createToolAction} />
        </section>
      ) : null}

      <section className="space-y-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h3 className="text-lg font-medium text-slate-900">Tools existentes ({filteredTools.length})</h3>
          <form action="/admin/tools" method="get" className="flex w-full gap-2 md:w-auto md:min-w-[420px]">
            <input name="q" defaultValue={params.q ?? ""} placeholder="Buscar por nombre, slug, empresa o URL..." className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-0 transition focus:border-slate-300" />
            <button type="submit" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 transition hover:bg-slate-50">Buscar</button>
            {query ? <Link href="/admin/tools" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50">Limpiar</Link> : null}
          </form>
        </div>

        {filteredTools.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
            {query ? "No se encontraron tools para esta búsqueda." : "No hay tools todavía."}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTools.map((tool) => (
              <ToolEditorItem key={tool.id} tool={tool} areas={areas} useCases={useCases} updateAction={updateToolAction} deleteAction={deleteToolAction} defaultOpen={query ? tool.slug === query || tool.name.toLowerCase() === query : false} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
