import { getSupabaseServerClient } from "@/lib/supabase/server";

export type FundamentalsPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  ia_type: string | null;
  published_at: string | null;
};

export type FundamentalsTool = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  ia_type: string | null;
  plan: "free" | "freemium" | "paid" | "edu_free";
  edu_verified: boolean;
};

export type FundamentalsFeed = {
  posts: FundamentalsPost[];
  tools: FundamentalsTool[];
};

export async function fetchFundamentalsFeed(): Promise<FundamentalsFeed> {
  const supabase = getSupabaseServerClient();
  const nowIso = new Date().toISOString();

  const [postsResult, toolsResult] = await Promise.all([
    supabase
      .from("posts")
      .select("id, title, slug, excerpt, ia_type, published_at")
      .eq("status", "published")
      .or(`published_at.is.null,published_at.lte.${nowIso}`)
      .order("published_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })
      .limit(6),
    supabase
      .from("tools")
      .select("id, name, slug, description, ia_type, plan, edu_verified")
      .eq("status", "published")
      .in("plan", ["free", "edu_free", "freemium"])
      .order("featured", { ascending: false })
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  if (postsResult.error) {
    console.error("[fundamentals-repo] posts:", postsResult.error.message);
  }

  if (toolsResult.error) {
    console.error("[fundamentals-repo] tools:", toolsResult.error.message);
  }

  return {
    posts: ((postsResult.data ?? []) as FundamentalsPost[]),
    tools: ((toolsResult.data ?? []) as FundamentalsTool[]),
  };
}
