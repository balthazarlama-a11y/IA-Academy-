import { getSupabaseServerAuthClient, getSupabaseServerClient } from "@/lib/supabase/server";
import type { RelatedPostSummary, Tool, ToolArea, ToolPlan, ToolUseCase } from "@/lib/types/tool";

type ContentStatus = "draft" | "scheduled" | "published" | "archived";

export type AdminRelationPost = {
  id: string;
  title: string;
  slug: string;
  status: ContentStatus;
  published_at: string | null;
  updated_at: string;
};

export type AdminRelationTool = {
  id: string;
  name: string;
  slug: string;
  status: ContentStatus;
  plan: ToolPlan;
  updated_at: string;
};

export type AdminPostToolRelation = {
  postId: string;
  toolId: string;
  sortOrder: number;
  createdAt: string;
  post: Pick<AdminRelationPost, "id" | "title" | "slug" | "status">;
  tool: Pick<AdminRelationTool, "id" | "name" | "slug" | "status" | "plan">;
};

export type RelatedToolForPost = Pick<
  Tool,
  | "id"
  | "name"
  | "slug"
  | "description"
  | "plan"
  | "ia_type"
  | "areas"
  | "primaryArea"
  | "useCases"
> & { sortOrder: number };

type RawArea = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color_accent: string | null;
  icon_name: string | null;
  sort_order: number;
};

type RawUseCase = RawArea;

type RawPostToolRelation = {
  post_id: string;
  tool_id: string;
  sort_order: number;
  created_at: string;
  posts:
    | { id: string; title: string; slug: string; status: ContentStatus }
    | { id: string; title: string; slug: string; status: ContentStatus }[]
    | null;
  tools:
    | { id: string; name: string; slug: string; status: ContentStatus; plan: ToolPlan }
    | { id: string; name: string; slug: string; status: ContentStatus; plan: ToolPlan }[]
    | null;
};

type RawRelatedToolRelation = {
  sort_order: number;
  tools:
    | {
        id: string;
        name: string;
        slug: string;
        description: string | null;
        plan: ToolPlan;
        ia_type: string | null;
        tool_areas:
          | { sort_order: number; areas: RawArea | RawArea[] | null }[]
          | null;
        tool_use_cases:
          | { sort_order: number; use_cases: RawUseCase | RawUseCase[] | null }[]
          | null;
      }
    | {
        id: string;
        name: string;
        slug: string;
        description: string | null;
        plan: ToolPlan;
        ia_type: string | null;
        tool_areas:
          | { sort_order: number; areas: RawArea | RawArea[] | null }[]
          | null;
        tool_use_cases:
          | { sort_order: number; use_cases: RawUseCase | RawUseCase[] | null }[]
          | null;
      }[]
    | null;
};

type RawRelatedPostRelation = {
  sort_order: number;
  posts:
    | { id: string; slug: string; title: string; excerpt: string | null; published_at: string | null }
    | { id: string; slug: string; title: string; excerpt: string | null; published_at: string | null }[]
    | null;
};

function pickFirst<T>(value: T | T[] | null): T | null {
  if (!value) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

function mapArea(row: RawArea | null): ToolArea | null {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    color_accent: row.color_accent,
    icon_name: row.icon_name,
    sort_order: row.sort_order,
  };
}

function mapUseCase(row: RawUseCase | null): ToolUseCase | null {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    color_accent: row.color_accent,
    icon_name: row.icon_name,
    sort_order: row.sort_order,
  };
}

function buildRelatedTool(row: RawRelatedToolRelation): RelatedToolForPost | null {
  const tool = pickFirst(row.tools);
  if (!tool) return null;

  const areas = (tool.tool_areas ?? [])
    .map((relation) => ({ sort_order: relation.sort_order, area: mapArea(pickFirst(relation.areas)) }))
    .filter((entry): entry is { sort_order: number; area: ToolArea } => Boolean(entry.area))
    .sort((left, right) => left.sort_order - right.sort_order)
    .map((entry) => entry.area);

  const useCases = (tool.tool_use_cases ?? [])
    .map((relation) => ({ sort_order: relation.sort_order, useCase: mapUseCase(pickFirst(relation.use_cases)) }))
    .filter((entry): entry is { sort_order: number; useCase: ToolUseCase } => Boolean(entry.useCase))
    .sort((left, right) => left.sort_order - right.sort_order)
    .map((entry) => entry.useCase);

  return {
    id: tool.id,
    name: tool.name,
    slug: tool.slug,
    description: tool.description,
    plan: tool.plan,
    ia_type: tool.ia_type,
    areas,
    primaryArea: areas[0] ?? null,
    useCases,
    sortOrder: row.sort_order,
  };
}

export async function listAdminPostsForRelations(limit = 250): Promise<AdminRelationPost[]> {
  const supabase = await getSupabaseServerAuthClient();
  const { data, error } = await supabase
    .from("posts")
    .select("id, title, slug, status, published_at, updated_at")
    .order("updated_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[post-tools-repo] listAdminPostsForRelations:", error.message);
    return [];
  }

  return ((data as AdminRelationPost[] | null) ?? []);
}

export async function listAdminToolsForRelations(limit = 250): Promise<AdminRelationTool[]> {
  const supabase = await getSupabaseServerAuthClient();
  const { data, error } = await supabase
    .from("tools")
    .select("id, name, slug, status, plan, updated_at")
    .order("updated_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[post-tools-repo] listAdminToolsForRelations:", error.message);
    return [];
  }

  return ((data as AdminRelationTool[] | null) ?? []);
}

export async function listAdminPostToolRelations(limit = 500): Promise<AdminPostToolRelation[]> {
  const supabase = await getSupabaseServerAuthClient();
  const { data, error } = await supabase
    .from("post_tools")
    .select("post_id, tool_id, sort_order, created_at, posts(id, title, slug, status), tools(id, name, slug, status, plan)")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[post-tools-repo] listAdminPostToolRelations:", error.message);
    return [];
  }

  return (((data as RawPostToolRelation[] | null) ?? []))
    .map((row) => {
      const post = pickFirst(row.posts);
      const tool = pickFirst(row.tools);
      if (!post || !tool) return null;
      return {
        postId: row.post_id,
        toolId: row.tool_id,
        sortOrder: row.sort_order,
        createdAt: row.created_at,
        post,
        tool,
      } satisfies AdminPostToolRelation;
    })
    .filter((row): row is AdminPostToolRelation => row !== null);
}

export async function linkToolToPost(input: { postId: string; toolId: string; sortOrder: number }): Promise<{ ok: boolean; error?: string }> {
  if (!input.postId?.trim()) return { ok: false, error: "ID de post invalido" };
  if (!input.toolId?.trim()) return { ok: false, error: "ID de tool invalido" };
  if (!Number.isFinite(input.sortOrder) || input.sortOrder < 0) return { ok: false, error: "Orden invalido" };

  const supabase = await getSupabaseServerAuthClient();
  const { error } = await supabase.from("post_tools").upsert(
    {
      post_id: input.postId.trim(),
      tool_id: input.toolId.trim(),
      sort_order: Math.floor(input.sortOrder),
    },
    { onConflict: "post_id,tool_id" },
  );

  if (error) {
    console.error("[post-tools-repo] linkToolToPost:", error.message, error.code);
    if (error.code === "23503") return { ok: false, error: "El post o la tool no existen" };
    if (error.code === "42501") return { ok: false, error: "No tienes permisos para realizar esta accion" };
    return { ok: false, error: `Error de base de datos: ${error.message}` };
  }

  return { ok: true };
}

export async function unlinkToolFromPost(input: { postId: string; toolId: string }): Promise<{ ok: boolean; error?: string }> {
  if (!input.postId?.trim()) return { ok: false, error: "ID de post invalido" };
  if (!input.toolId?.trim()) return { ok: false, error: "ID de tool invalido" };

  const supabase = await getSupabaseServerAuthClient();
  const { error } = await supabase
    .from("post_tools")
    .delete()
    .eq("post_id", input.postId.trim())
    .eq("tool_id", input.toolId.trim());

  if (error) {
    console.error("[post-tools-repo] unlinkToolFromPost:", error.message, error.code);
    if (error.code === "42501") return { ok: false, error: "No tienes permisos para realizar esta accion" };
    return { ok: false, error: `Error de base de datos: ${error.message}` };
  }

  return { ok: true };
}

export async function getRelatedToolsByPostSlug(slug: string): Promise<RelatedToolForPost[]> {
  const supabase = getSupabaseServerClient();
  const nowIso = new Date().toISOString();
  const { data: postData, error: postError } = await supabase
    .from("posts")
    .select("id")
    .eq("slug", slug)
    .eq("status", "published")
    .or(`published_at.is.null,published_at.lte.${nowIso}`)
    .maybeSingle();

  if (postError || !postData?.id) return [];

  const { data, error } = await supabase
    .from("post_tools")
    .select("sort_order, tools(id, name, slug, description, plan, ia_type, tool_areas(sort_order, areas(id, name, slug, description, color_accent, icon_name, sort_order)), tool_use_cases(sort_order, use_cases(id, name, slug, description, color_accent, icon_name, sort_order)))")
    .eq("post_id", postData.id)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[post-tools-repo] getRelatedToolsByPostSlug:", error.message);
    return [];
  }

  return (((data as RawRelatedToolRelation[] | null) ?? [])
    .map(buildRelatedTool)
    .filter((row): row is RelatedToolForPost => row !== null));
}

export async function getRelatedPostsByToolSlug(slug: string): Promise<RelatedPostSummary[]> {
  const supabase = getSupabaseServerClient();
  const { data: toolData, error: toolError } = await supabase
    .from("tools")
    .select("id")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (toolError || !toolData?.id) return [];

  const { data, error } = await supabase
    .from("post_tools")
    .select("sort_order, posts(id, slug, title, excerpt, published_at)")
    .eq("tool_id", toolData.id)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[post-tools-repo] getRelatedPostsByToolSlug:", error.message);
    return [];
  }

  return (((data as RawRelatedPostRelation[] | null) ?? []))
    .map((row) => {
      const post = pickFirst(row.posts);
      if (!post) return null;
      return {
        id: post.id,
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        publishedAt: post.published_at,
        sortOrder: row.sort_order,
      } satisfies RelatedPostSummary;
    })
    .filter((row): row is RelatedPostSummary => row !== null);
}
