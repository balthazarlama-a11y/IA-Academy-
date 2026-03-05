import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  }

  if (!anonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  return createClient(url, anonKey, {
    auth: {
      persistSession: false,
    },
  });
}

export async function getSupabaseServerAuthClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  }

  if (!anonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

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

export type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  ia_type: string | null;
  published_at: string | null;
};

export type PostDetail = Post & {
  content_md: string;
  post_kind: "blog" | "tool" | "guide" | "news";
  created_at: string;
};

export async function fetchPublishedPosts() {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("posts")
    .select("id, title, slug, excerpt, cover_image_url, ia_type, published_at")
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

export async function fetchPublishedPostBySlug(slug: string) {
  try {
    const supabase = getSupabaseServerClient();

    const { data, error } = await supabase
      .from("posts")
      .select(
        "id, title, slug, excerpt, cover_image_url, ia_type, published_at, content_md, post_kind, created_at",
      )
      .eq("slug", slug)
      .eq("status", "published")
      .or(`published_at.is.null,published_at.lte.${new Date().toISOString()}`)
      .maybeSingle();

    if (error) {
      console.error("Error fetching post by slug:", error);
      return null;
    }

    return (data as PostDetail | null) ?? null;
  } catch (error) {
    console.error("Unexpected error fetching post by slug:", error);
    return null;
  }
}
