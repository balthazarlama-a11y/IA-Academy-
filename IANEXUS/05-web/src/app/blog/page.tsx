import BlogEmptyState from "@/components/blog/blog-empty-state";
import BlogPostCard from "@/components/blog/blog-post-card";
import LatestUpdatesSection from "@/components/blog/latest-updates-section";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { CommunityCtaBanner } from "@/components/marketing/community-cta-banner";
import { fetchPublishedPosts } from "@/lib/supabase/server";

// ISR cada 5 minutos
export const revalidate = 300;

export default async function BlogPage() {
  const posts = await fetchPublishedPosts();
  const latestNews = posts.filter((post) => post.post_kind === "news").slice(0, 3);
  const libraryPosts = posts.filter((post) => post.post_kind !== "news");

  return (
    <main className="relative min-h-screen flex flex-col" style={{ background: "#f5f7fb" }}>
      <Header />

      <section className="flex-1 w-full px-6 py-10 md:py-14">
        <div className="mx-auto w-full max-w-6xl">
          <header className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
            <p className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs uppercase tracking-[0.14em] text-slate-600">
              Biblioteca IA NEXUS
            </p>
            <h1
              className="mt-4 text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight"
              style={{
                backgroundImage:
                  "linear-gradient(95deg, #2563eb 0%, #7c3aed 45%, #0f766e 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Blog y updates publicados
            </h1>
            <p className="mt-3 max-w-2xl text-base text-slate-600 md:text-lg">
              Recursos curados para estudiar, trabajar y seguir los cambios mas importantes de IA.
            </p>
          </header>

          {latestNews.length > 0 ? (
            <div className="mt-8">
              <LatestUpdatesSection
                posts={latestNews}
                title="Ultimas actualizaciones"
                subtitle="Novedades cortas, lanzamientos y cambios que conviene revisar primero."
              />
            </div>
          ) : null}

          <div className="mt-8">
            {libraryPosts.length > 0 ? (
              <>
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900 md:text-2xl">
                      Biblioteca de guias y posts
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Contenido mas profundo para estudiar despues de revisar los updates.
                    </p>
                  </div>
                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600">
                    {libraryPosts.length} publicaciones
                  </span>
                </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {libraryPosts.map((post) => (
                  <BlogPostCard key={post.id} post={post} />
                ))}
              </div>
              </>
            ) : posts.length > 0 ? null : (
              <BlogEmptyState />
            )}
          </div>

          {/* CTA Comunidad */}
          <div className="mt-12">
            <CommunityCtaBanner location="blog_banner" />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
