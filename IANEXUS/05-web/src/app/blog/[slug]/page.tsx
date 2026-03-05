import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { PostContent } from "@/components/blog/post-content";
import RelatedTools from "@/components/blog/related-tools";
import { getCurrentUser } from "@/lib/auth/session";
import { hasAdminAccess } from "@/lib/auth/roles";
import { fetchPublishedPostBySlug } from "@/lib/supabase/server";
import { getRelatedToolsByPostSlug } from "@/lib/repositories/post-tools-repo";

// Cache estático con ISR cada 5 minutos
export const dynamic = "force-dynamic";

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

  // El post es el dato crítico: si no existe/publicado => 404
  const post = await fetchPublishedPostBySlug(decodedSlug);

  if (!post) {
    notFound();
  }

  // Datos auxiliares con fallback para evitar 500 por dependencias no críticas
  const [viewer, relatedTools] = await Promise.all([
    getCurrentUser().catch(() => null),
    getRelatedToolsByPostSlug(decodedSlug).catch(() => []),
  ]);

  const isLoggedIn = Boolean(viewer);
  const isStaff = hasAdminAccess(viewer?.role ?? null);
  const safeSlug = typeof post.slug === "string" ? post.slug : decodedSlug;
  const safeTitle = typeof post.title === "string" ? post.title : "Post";
  const safeExcerpt = typeof post.excerpt === "string" ? post.excerpt : null;
  const safeContent = typeof post.content_md === "string" ? post.content_md : "";
  const date = formatDate(post.published_at || post.created_at);

  return (
    <main className="relative min-h-screen flex flex-col">
      <Header />

      <section className="flex-1 w-full px-6 py-8 md:py-10">
        <article className="mx-auto w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 md:p-10">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/blog"
              className="inline-flex text-sm text-slate-500 hover:text-slate-700 transition-colors"
            >
              ← Volver al blog
            </Link>
            {isStaff && (
              <Link
                href={`/admin/posts?q=${encodeURIComponent(safeSlug)}`}
                aria-label={`Editar post "${safeTitle}" en Admin`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M8.5 1.5l2 2L4 10H2V8L8.5 1.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                </svg>
                Editar en Admin
              </Link>
            )}
          </div>

          <header className="mt-6">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-slate-900 leading-tight">
              {safeTitle}
            </h1>
            {date && (
              <div className="mt-2 text-sm text-slate-500">
                {date}
              </div>
            )}
            {safeExcerpt ? (
              <p className="mt-4 text-slate-600 text-base leading-relaxed">{safeExcerpt}</p>
            ) : null}
          </header>

          <Suspense fallback={<ContentSkeleton />}>
            <PostContent content={safeContent} isLoggedIn={isLoggedIn} slug={safeSlug} />
          </Suspense>

          <RelatedTools tools={relatedTools} />
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
