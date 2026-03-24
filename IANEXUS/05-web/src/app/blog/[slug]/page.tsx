import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache, Suspense } from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { PostContent } from "@/components/blog/post-content";
import RelatedTools from "@/components/blog/related-tools";
import { getCurrentUser } from "@/lib/auth/session";
import { hasAdminAccess } from "@/lib/auth/roles";
import { buildPageMetadata, normalizeDescription } from "@/lib/seo";
import { fetchPublishedPostBySlug } from "@/lib/supabase/server";
import { getRelatedToolsByPostSlug } from "@/lib/repositories/post-tools-repo";

export const dynamic = "force-dynamic";

const getPublishedPost = cache(async (slug: string) => fetchPublishedPostBySlug(slug));

function formatDate(value: string | null) {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  try {
    return new Intl.DateTimeFormat("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(parsed);
  } catch {
    return "";
  }
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  let decodedSlug = "";
  try {
    decodedSlug = decodeURIComponent(slug);
  } catch {
    return buildPageMetadata({
      title: "Post no encontrado",
      path: `/blog/${slug}`,
      noIndex: true,
    });
  }

  const post = await getPublishedPost(decodedSlug);
  if (!post) {
    return buildPageMetadata({
      title: "Post no encontrado",
      path: `/blog/${decodedSlug}`,
      noIndex: true,
    });
  }

  const typeLabel = post.post_kind === "news" ? "Novedad" : "Guia";
  return buildPageMetadata({
    title: `${post.title} | ${typeLabel}`,
    description: normalizeDescription(post.subtitle ?? post.excerpt, `Lee ${post.title} en IA NEXUS.`),
    path: `/blog/${post.slug}`,
    image: post.cover_image_url,
    type: "article",
    keywords: ["blog IA", post.ia_type ?? "inteligencia artificial", post.post_kind],
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;

  let decodedSlug = "";
  try {
    decodedSlug = decodeURIComponent(slug);
  } catch {
    notFound();
  }

  if (!decodedSlug.trim()) {
    notFound();
  }

  const post = await getPublishedPost(decodedSlug);

  if (!post) {
    notFound();
  }

  const [viewer, relatedTools] = await Promise.all([
    getCurrentUser().catch(() => null),
    getRelatedToolsByPostSlug(decodedSlug).catch(() => []),
  ]);

  const isLoggedIn = Boolean(viewer);
  const isStaff = hasAdminAccess(viewer?.role ?? null);
  const safeSlug = typeof post.slug === "string" ? post.slug : decodedSlug;
  const safeTitle = typeof post.title === "string" ? post.title : "Post";
  const safeSubtitle = typeof post.subtitle === "string" ? post.subtitle : null;
  const safeExcerpt = typeof post.excerpt === "string" ? post.excerpt : null;
  const safeContent = typeof post.content_md === "string" ? post.content_md : "";
  const safeContentJson = Array.isArray(post.content_json) ? post.content_json : [];
  const date = formatDate(post.published_at || post.created_at);

  return (
    <main className="relative min-h-screen flex flex-col">
      <Header />

      <section className="flex-1 w-full px-4 py-6 md:px-6 md:py-10">
        <article className="mx-auto w-full max-w-6xl rounded-[2rem] border border-slate-200 bg-white px-5 py-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)] md:px-8 md:py-8 lg:px-10">
          <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <Link href="/blog" className="inline-flex text-sm text-slate-500 transition-colors hover:text-slate-700">
              ← Volver al blog
            </Link>
            {isStaff ? (
              <Link
                href={`/admin/posts?q=${encodeURIComponent(safeSlug)}`}
                aria-label={`Editar post "${safeTitle}" en Admin`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M8.5 1.5l2 2L4 10H2V8L8.5 1.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
                </svg>
                Editar en Admin
              </Link>
            ) : null}
          </div>

          <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_290px]">
            <div className="min-w-0">
              <header>
                <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500">
                  {post.post_kind === "news" ? "Actualización" : "Artículo"}
                </p>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl lg:text-5xl">
                  {safeTitle}
                </h1>
                {safeSubtitle ? (
                  <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600 md:text-xl">
                    {safeSubtitle}
                  </p>
                ) : null}
                {safeExcerpt ? (
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500 md:text-base">
                    {safeExcerpt}
                  </p>
                ) : null}
                {date ? <div className="mt-4 text-sm text-slate-500">{date}</div> : null}
              </header>

              {post.cover_image_url ? (
                <figure className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-slate-100">
                  <div className="relative aspect-[16/9] w-full bg-slate-100">
                    <Image
                      src={post.cover_image_url}
                      alt={post.hero_image_alt || safeTitle}
                      fill
                      unoptimized
                      sizes="(min-width: 1024px) 900px, 100vw"
                      className="object-cover"
                    />
                  </div>
                  {post.hero_image_caption ? (
                    <figcaption className="border-t border-slate-200 px-4 py-3 text-sm text-slate-500">
                      {post.hero_image_caption}
                    </figcaption>
                  ) : null}
                </figure>
              ) : null}

              <Suspense fallback={<ContentSkeleton />}>
                <PostContent content={safeContent} contentJson={safeContentJson} isLoggedIn={isLoggedIn} slug={safeSlug} />
              </Suspense>

              <div className="mt-10">
                <RelatedTools tools={relatedTools} />
              </div>
            </div>

            <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
                  Ficha rápida
                </p>
                <dl className="mt-4 space-y-4">
                  <div>
                    <dt className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500">Tipo</dt>
                    <dd className="mt-1 text-sm font-medium text-slate-900">{post.post_kind}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500">IA</dt>
                    <dd className="mt-1 text-sm font-medium text-slate-900">{post.ia_type || "General"}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500">Publicado</dt>
                    <dd className="mt-1 text-sm font-medium text-slate-900">{date || "Reciente"}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500">Slug</dt>
                    <dd className="mt-1 break-words text-sm font-medium text-slate-900">{safeSlug}</dd>
                  </div>
                </dl>
              </div>
            </aside>
          </div>
        </article>
      </section>

      <Footer />
    </main>
  );
}

function ContentSkeleton() {
  return (
    <div className="mt-8 space-y-4 animate-pulse">
      <div className="h-4 w-full rounded bg-slate-50" />
      <div className="h-4 w-5/6 rounded bg-slate-50" />
      <div className="h-4 w-4/6 rounded bg-slate-50" />
      <div className="h-6 w-2/3 rounded bg-slate-50 mt-6" />
      <div className="h-4 w-full rounded bg-slate-50" />
      <div className="h-4 w-5/6 rounded bg-slate-50" />
    </div>
  );
}
