import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import {
  normalizePostContentBlocks,
  type Post,
  type PostDetail,
} from "@/lib/types/post";

function getRequiredSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  }

  if (!anonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  return { url, anonKey };
}

export function getSupabaseServerClient() {
  const { url, anonKey } = getRequiredSupabaseEnv();

  return createClient(url, anonKey, {
    auth: {
      persistSession: false,
    },
  });
}

export async function getSupabaseServerAuthClient() {
  const { url, anonKey } = getRequiredSupabaseEnv();

  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components might attempt setting cookies in unsupported contexts.
        }
      },
    },
  });
}

export function getSupabaseServiceRoleClient() {
  const { url } = getRequiredSupabaseEnv();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export type { Post, PostDetail } from "@/lib/types/post";

export async function fetchPublishedPosts() {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("posts")
    .select(
      "id, title, subtitle, slug, excerpt, cover_image_url, hero_image_alt, hero_image_caption, ia_type, post_kind, published_at",
    )
    .eq("status", "published")
    .or(`published_at.is.null,published_at.lte.${new Date().toISOString()}`)
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })
    .limit(50); // Limitar para evitar payloads grandes

  if (error) {
    console.error("Error fetching posts:", error);
    return [];
  }

  return (data as Post[]) || [];
}

export async function fetchPublishedNews(limit = 6) {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("posts")
    .select(
      "id, title, subtitle, slug, excerpt, cover_image_url, hero_image_alt, hero_image_caption, ia_type, post_kind, published_at",
    )
    .eq("status", "published")
    .eq("post_kind", "news")
    .or(`published_at.is.null,published_at.lte.${new Date().toISOString()}`)
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching news posts:", error);
    return [];
  }

  return (data as Post[]) || [];
}

export async function fetchPublishedPostBySlug(slug: string) {
  try {
    const supabase = getSupabaseServerClient();

    const { data, error } = await supabase
      .from("posts")
      .select(
        "id, title, subtitle, slug, excerpt, cover_image_url, hero_image_alt, hero_image_caption, ia_type, published_at, content_md, content_json, post_kind, created_at, updated_at",
      )
      .eq("slug", slug)
      .eq("status", "published")
      .or(`published_at.is.null,published_at.lte.${new Date().toISOString()}`)
      .maybeSingle();

    if (error) {
      console.error("Error fetching post by slug:", error);
      return null;
    }

    if (!data) {
      return null;
    }

    return {
      ...(data as PostDetail),
      content_json: normalizePostContentBlocks((data as PostDetail).content_json ?? []),
    };
  } catch (error) {
    console.error("Unexpected error fetching post by slug:", error);
    return null;
  }
}
