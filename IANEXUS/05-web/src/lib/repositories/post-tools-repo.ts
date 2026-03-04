import { getSupabaseServerAuthClient, getSupabaseServerClient } from "@/lib/supabase/server";
import type { RelatedPostSummary, ToolPlan } from "@/lib/types/tool";

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

export type RelatedToolForPost = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  plan: ToolPlan;
  iaType: string | null;
  category: {
    name: string;
    slug: string;
    colorAccent: string | null;
  };
  sortOrder: number;
};

type RawPostToolRelation = {
  post_id: string;
  tool_id: string;
  sort_order: number;
  created_at: string;
  posts:
    | {
        id: string;
        title: string;
        slug: string;
        status: ContentStatus;
      }
    | {
        id: string;
        title: string;
        slug: string;
        status: ContentStatus;
      }[]
    | null;
  tools:
    | {
        id: string;
        name: string;
        slug: string;
        status: ContentStatus;
        plan: ToolPlan;
      }
    | {
        id: string;
        name: string;
        slug: string;
        status: ContentStatus;
        plan: ToolPlan;
      }[]
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
        tool_categories:
          | {
              name: string;
              slug: string;
              color_accent: string | null;
            }
          | {
              name: string;
              slug: string;
              color_accent: string | null;
            }[]
          | null;
      }
    | {
        id: string;
        name: string;
        slug: string;
        description: string | null;
        plan: ToolPlan;
        ia_type: string | null;
        tool_categories:
          | {
              name: string;
              slug: string;
              color_accent: string | null;
            }
          | {
              name: string;
              slug: string;
              color_accent: string | null;
            }[]
          | null;
      }[]
    | null;
};

type RawRelatedPostRelation = {
  sort_order: number;
  posts:
    | {
        id: string;
        slug: string;
        title: string;
        excerpt: string | null;
        published_at: string | null;
      }
    | {
        id: string;
        slug: string;
        title: string;
        excerpt: string | null;
        published_at: string | null;
      }[]
    | null;
};

function pickFirst<T>(value: T | T[] | null): T | null {
  if (!value) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
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

      if (!post || !tool) {
        return null;
      }

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

export async function linkToolToPost(input: {
  postId: string;
  toolId: string;
  sortOrder: number;
}): Promise<{ ok: boolean; error?: string }> {
  const supabase = await getSupabaseServerAuthClient();

  const { error } = await supabase.from("post_tools").upsert(
    {
      post_id: input.postId,
      tool_id: input.toolId,
      sort_order: input.sortOrder,
    },
    { onConflict: "post_id,tool_id" },
  );

  if (error) {
    console.error("[post-tools-repo] linkToolToPost:", error.message);
    return { ok: false, error: error.message };
  }

  return { ok: true };
}

export async function unlinkToolFromPost(input: {
  postId: string;
  toolId: string;
}): Promise<{ ok: boolean; error?: string }> {
  const supabase = await getSupabaseServerAuthClient();

  const { error } = await supabase
    .from("post_tools")
    .delete()
    .eq("post_id", input.postId)
    .eq("tool_id", input.toolId);

  if (error) {
    console.error("[post-tools-repo] unlinkToolFromPost:", error.message);
    return { ok: false, error: error.message };
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

  if (postError || !postData?.id) {
    return [];
  }

  const { data, error } = await supabase
    .from("post_tools")
    .select("sort_order, tools(id, name, slug, description, plan, ia_type, tool_categories(name, slug, color_accent))")
    .eq("post_id", postData.id)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[post-tools-repo] getRelatedToolsByPostSlug:", error.message);
    return [];
  }

  return (((data as RawRelatedToolRelation[] | null) ?? []))
    .map((row) => {
      const tool = pickFirst(row.tools);
      if (!tool) return null;

      const category = pickFirst(tool.tool_categories);
      if (!category) return null;

      return {
        id: tool.id,
        name: tool.name,
        slug: tool.slug,
        description: tool.description,
        plan: tool.plan,
        iaType: tool.ia_type,
        category: {
          name: category.name,
          slug: category.slug,
          colorAccent: category.color_accent,
        },
        sortOrder: row.sort_order,
      } satisfies RelatedToolForPost;
    })
    .filter((row): row is RelatedToolForPost => row !== null);
}

export async function getRelatedPostsByToolSlug(slug: string): Promise<RelatedPostSummary[]> {
  const supabase = getSupabaseServerClient();

  const { data: toolData, error: toolError } = await supabase
    .from("tools")
    .select("id")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (toolError || !toolData?.id) {
    return [];
  }

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
