import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, BookOpenText } from "lucide-react";
import BlogEmptyState from "@/components/blog/blog-empty-state";
import BlogPostCard from "@/components/blog/blog-post-card";
import LatestUpdatesSection from "@/components/blog/latest-updates-section";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { CommunityCtaBanner } from "@/components/marketing/community-cta-banner";
import { fetchPublishedPosts } from "@/lib/supabase/server";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Blog de IA | YourAI",
  description:
    "Archivo editorial de YourAI con guias, notas y actualizaciones para seguir herramientas y cambios relevantes sin ruido.",
};

export default async function BlogPage() {
  const posts = await fetchPublishedPosts();
  const featuredPost = posts[0] ?? null;
  const latestNews = posts
    .filter((post) => post.post_kind === "news" && post.id !== featuredPost?.id)
    .slice(0, 3);
  const archivePosts = posts.filter(
    (post) =>
      post.id !== featuredPost?.id &&
      !latestNews.some((latestPost) => latestPost.id === post.id),
  );

  return (
    <main className="relative min-h-screen flex flex-col overflow-hidden bg-[linear-gradient(180deg,#f5f2ec_0%,#faf8f4_45%,#ffffff_100%)] text-slate-900">

      <Header />

      <section className="relative flex-1 w-full px-4 py-6 md:px-6 md:py-10">
        <div className="editorial-frame flex flex-col gap-6">
          <header className="overflow-hidden rounded-[1.5rem] ui-shell">
            <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="border-b ui-rule bg-[linear-gradient(180deg,rgba(247,243,236,0.8)_0%,rgba(255,255,255,0.95)_100%)] p-5 md:p-6 lg:border-b-0 lg:border-r lg:p-7">
                <p className="ui-label">Archivo editorial</p>

                <h1 className="ui-title mt-3 max-w-2xl text-[2.35rem] leading-[0.96] text-slate-950 md:text-[3.25rem]">
                  Blog, guias y notas para seguir IA con criterio.
                </h1>

                <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 md:text-base">
                  Un archivo curado para leer lanzamientos, herramientas y piezas utiles sin
                  caer en ruido promocional.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/areas"
                    className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
                  >
                    Explorar por áreas
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/dia-a-dia"
                    className="inline-flex items-center gap-2 rounded-full border border-slate-300/70 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                  >
                    Ver feed del día
                  </Link>
                </div>
              </div>

              <div className="p-5 md:p-6 lg:p-7">
                <div className="flex items-center justify-between gap-4 border-b ui-rule pb-3">
                  <div>
                    <p className="ui-label">En portada</p>
                    <p className="mt-1 text-sm text-slate-600">
                      La lectura principal del archivo hoy.
                    </p>
                  </div>
                  <BookOpenText className="h-4 w-4 text-slate-400" />
                </div>

                {featuredPost ? (
                  <div className="mt-4">
                    <BlogPostCard post={featuredPost} compact />
                  </div>
                ) : (
                  <div className="ui-empty mt-4 rounded-[1rem] p-5">
                    <p className="text-sm text-slate-600">
                      Cuando publiquemos la primera pieza aparecerá aquí como portada del
                      archivo.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </header>

          {latestNews.length > 0 ? (
            <LatestUpdatesSection
              posts={latestNews}
              title="Actualizaciones recientes"
              subtitle="Cambios y notas cortas que conviene revisar antes de entrar al archivo completo."
            />
          ) : null}

          <section className="rounded-[1.35rem] ui-shell p-4 md:p-5">
            <div className="mb-5 flex flex-col gap-2 border-b ui-rule pb-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="ui-label">Archivo</p>
                <h2 className="ui-title mt-1 text-[2.1rem] text-slate-950">
                  Todas las lecturas
                </h2>
              </div>

              <p className="text-sm text-slate-500">
                {archivePosts.length > 0
                  ? `${archivePosts.length} piezas disponibles`
                  : "Sin piezas adicionales por ahora"}
              </p>
            </div>

            {archivePosts.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {archivePosts.map((post) => (
                  <BlogPostCard key={post.id} post={post} />
                ))}
              </div>
            ) : posts.length > 0 ? (
              <BlogEmptyState
                title="Por ahora hay una sola lectura en portada"
                description="El archivo ya está abierto. Cuando publiquemos más guias y notas aparecerán aquí como biblioteca."
                primaryHref="/dia-a-dia"
                primaryLabel="Abrir feed del día"
                secondaryHref="/areas"
                secondaryLabel="Explorar áreas"
              />
            ) : (
              <BlogEmptyState />
            )}
          </section>

          <div className="mt-1">
            <CommunityCtaBanner location="blog_banner" />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
