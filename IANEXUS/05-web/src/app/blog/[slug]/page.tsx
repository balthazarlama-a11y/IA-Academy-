import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { PostContent } from "@/components/blog/post-content";
import RelatedTools from "@/components/blog/related-tools";
import { getCurrentUser } from "@/lib/auth/session";
import { fetchPublishedPostBySlug } from "@/lib/supabase/server";
import { getRelatedToolsByPostSlug } from "@/lib/repositories/post-tools-repo";

// Cache estático con ISR cada 5 minutos
export const revalidate = 300;

export async function generateStaticParams() {
  // Pre-renderizar posts populares en build
  return [];
}

function formatDate(value: string | null) {
  if (!value) return "";
  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  // Fetch en paralelo
  const [post, viewer, relatedTools] = await Promise.all([
    fetchPublishedPostBySlug(decodedSlug),
    getCurrentUser(),
    getRelatedToolsByPostSlug(decodedSlug),
  ]);

  if (!post) {
    notFound();
  }

  const isLoggedIn = Boolean(viewer);
  const date = formatDate(post.published_at || post.created_at);

  return (
    <main className="relative min-h-screen flex flex-col">
      <Header />

      <section className="flex-1 w-full px-6 py-8 md:py-10">
        <article className="mx-auto w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 md:p-10">
          <Link
            href="/blog"
            className="inline-flex text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            ← Volver al blog
          </Link>

          <header className="mt-6">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-slate-900 leading-tight">
              {post.title}
            </h1>
            {date && (
              <div className="mt-2 text-sm text-slate-500">
                {date}
              </div>
            )}
            {post.excerpt ? (
              <p className="mt-4 text-slate-600 text-base leading-relaxed">{post.excerpt}</p>
            ) : null}
          </header>

          <Suspense fallback={<ContentSkeleton />}>
            <PostContent content={post.content_md} isLoggedIn={isLoggedIn} slug={post.slug} />
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
