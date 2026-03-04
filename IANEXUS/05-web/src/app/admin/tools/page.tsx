import Link from "next/link";
import { Wrench } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/session";
import { getSupabaseServerAuthClient } from "@/lib/supabase/server";
import UploadImageField from "@/components/admin/upload-image-field";
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

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-CL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function getToolCategoryName(value: AdminToolRow["tool_categories"]) {
  if (!value) return "Sin categoria";
  if (Array.isArray(value)) return value[0]?.name ?? "Sin categoria";
  return value.name;
}

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
      .limit(150),
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
          <h2 className="text-2xl font-semibold text-white/90">Tools</h2>
          <p className="text-sm text-white/50">Gestiona herramientas publicadas y borradores.</p>
        </div>
        <Link
          href="/admin/posts"
          className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/85 transition hover:bg-white/10"
        >
          Ir a Posts
        </Link>
      </div>

      {successMessage ? (
        <div className="rounded-xl border border-emerald-300/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
          {successMessage}
        </div>
      ) : null}

      {errorMessage ? (
        <div className="rounded-xl border border-red-300/30 bg-red-400/10 px-4 py-3 text-sm text-red-100">
          {errorMessage}
        </div>
      ) : null}

      <section
        className="rounded-2xl p-5"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)" }}
      >
        <h3 className="mb-4 text-lg font-medium text-white/90">Nueva tool</h3>
        <form action={createToolAction} encType="multipart/form-data" className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <input name="name" required placeholder="Nombre" className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none" />
          <input name="slug" placeholder="slug-opcional" className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none" />
          <input name="url" required placeholder="https://..." className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none md:col-span-2" />
          <textarea name="description" rows={2} placeholder="Descripcion" className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none md:col-span-2" />
          <UploadImageField fileInputName="cover_image_file" urlInputName="cover_image_url" label="Imagen / logo" colSpan="md:col-span-2" />
          <select name="category_id" required className="rounded-lg border border-white/15 bg-[#11111a] px-3 py-2 text-sm text-white outline-none">
            <option value="">Selecciona categoria</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
          <input name="ia_type" placeholder="Tipo IA (opcional)" className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none" />
          <select name="plan" defaultValue="free" className="rounded-lg border border-white/15 bg-[#11111a] px-3 py-2 text-sm text-white outline-none">
            <option value="free">Free</option>
            <option value="edu_free">Edu Free</option>
            <option value="freemium">Freemium</option>
            <option value="paid">Paid</option>
          </select>
          <select name="level" defaultValue="all" className="rounded-lg border border-white/15 bg-[#11111a] px-3 py-2 text-sm text-white outline-none">
            <option value="all">All</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          <select name="status" defaultValue="published" className="rounded-lg border border-white/15 bg-[#11111a] px-3 py-2 text-sm text-white outline-none">
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
          <input name="sort_order" type="number" min={0} defaultValue={0} className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none" />

          <label className="inline-flex items-center gap-2 text-sm text-white/80"><input name="verified" type="checkbox" /> Verificada</label>
          <label className="inline-flex items-center gap-2 text-sm text-white/80"><input name="edu_verified" type="checkbox" /> Edu verificada</label>
          <label className="inline-flex items-center gap-2 text-sm text-white/80 md:col-span-2"><input name="featured" type="checkbox" /> Destacada</label>

          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white"
              style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}
            >
              Crear tool
            </button>
          </div>
        </form>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-medium text-white/90">Tools existentes ({tools.length})</h3>

        {tools.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center text-sm text-white/50">
            No hay tools todavia.
          </div>
        ) : (
          tools.map((tool) => (
            <details key={tool.id} className="rounded-xl border border-white/10 bg-white/[0.03]">
              <summary className="cursor-pointer list-none px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-white/90">{tool.name}</p>
                    <p className="text-xs text-white/50">/{tool.slug} - {tool.status} - {getToolCategoryName(tool.tool_categories)} - {formatDate(tool.updated_at)}</p>
                  </div>
                  <Wrench className="h-4 w-4 text-white/40" />
                </div>
              </summary>

              <div className="border-t border-white/10 p-4">
                <form action={updateToolAction} encType="multipart/form-data" className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <input type="hidden" name="id" value={tool.id} />
                  <input name="name" required defaultValue={tool.name} className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none" />
                  <input name="slug" required defaultValue={tool.slug} className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none" />
                  <input name="url" required defaultValue={tool.url} className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none md:col-span-2" />
                  <textarea name="description" rows={2} defaultValue={tool.description ?? ""} className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none md:col-span-2" />
                  <UploadImageField fileInputName="cover_image_file" urlInputName="cover_image_url" existingUrl={tool.cover_image_url} label="Imagen / logo" colSpan="md:col-span-2" />
                  <select name="category_id" defaultValue={tool.category_id} required className="rounded-lg border border-white/15 bg-[#11111a] px-3 py-2 text-sm text-white outline-none">
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                  <input name="ia_type" defaultValue={tool.ia_type ?? ""} className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none" />
                  <select name="plan" defaultValue={tool.plan} className="rounded-lg border border-white/15 bg-[#11111a] px-3 py-2 text-sm text-white outline-none">
                    <option value="free">Free</option>
                    <option value="edu_free">Edu Free</option>
                    <option value="freemium">Freemium</option>
                    <option value="paid">Paid</option>
                  </select>
                  <select name="level" defaultValue={tool.level} className="rounded-lg border border-white/15 bg-[#11111a] px-3 py-2 text-sm text-white outline-none">
                    <option value="all">All</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                  <select name="status" defaultValue={tool.status} className="rounded-lg border border-white/15 bg-[#11111a] px-3 py-2 text-sm text-white outline-none">
                    <option value="draft">Draft</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                  <input name="sort_order" type="number" min={0} defaultValue={tool.sort_order} className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none" />

                  <label className="inline-flex items-center gap-2 text-sm text-white/80">
                    <input name="verified" type="checkbox" defaultChecked={tool.verified} /> Verificada
                  </label>
                  <label className="inline-flex items-center gap-2 text-sm text-white/80">
                    <input name="edu_verified" type="checkbox" defaultChecked={tool.edu_verified} /> Edu verificada
                  </label>
                  <label className="inline-flex items-center gap-2 text-sm text-white/80 md:col-span-2">
                    <input name="featured" type="checkbox" defaultChecked={tool.featured} /> Destacada
                  </label>

                  <div className="md:col-span-2 flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/15"
                    >
                      Guardar cambios
                    </button>
                  </div>
                </form>
              </div>
            </details>
          ))
        )}
      </section>
    </div>
  );
}
