import type { MetadataRoute } from "next";
import { fetchPublishedPosts } from "@/lib/supabase/server";
import { getTools } from "@/lib/repositories/tools-repo";
import { absoluteUrl } from "@/lib/seo";

const STATIC_ROUTES = [
  "/",
  "/blog",
  "/areas",
  "/estudiantes",
  "/dia-a-dia",
  "/dia-a-dia/fundamentals",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, tools] = await Promise.all([
    fetchPublishedPosts().catch(() => []),
    getTools().catch(() => []),
  ]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: absoluteUrl(route),
    lastModified: new Date(),
    changeFrequency: route === "/" ? "daily" : "weekly",
    priority: route === "/" ? 1 : 0.7,
  }));

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: post.published_at ? new Date(post.published_at) : new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const toolEntries: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: absoluteUrl(`/herramientas/${tool.slug}`),
    lastModified: tool.created_at ? new Date(tool.created_at) : new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticEntries, ...postEntries, ...toolEntries];
}
