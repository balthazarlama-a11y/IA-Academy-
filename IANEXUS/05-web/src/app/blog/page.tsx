import BlogEmptyState from "@/components/blog/blog-empty-state";
import BlogPostCard from "@/components/blog/blog-post-card";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { fetchPublishedPosts } from "@/lib/supabase/server";

// ISR cada 5 minutos
export const revalidate = 300;

export default async function BlogPage() {
  const posts = await fetchPublishedPosts();

  return (
    <main className="relative min-h-screen flex flex-col" style={{ background: "#09090f" }}>
      <Header />

      <section className="flex-1 w-full px-6 py-10 md:py-14">
        <div className="mx-auto w-full max-w-6xl">
          <header className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 md:p-8">
            <p className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.14em] text-white/60">
              Biblioteca IA NEXUS
            </p>
            <h1
              className="mt-4 text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight"
              style={{
                backgroundImage:
                  "linear-gradient(95deg, rgba(186,230,253,1) 0%, rgba(196,181,253,1) 40%, rgba(167,243,208,1) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Posts publicados
            </h1>
            <p className="mt-3 max-w-2xl text-base text-white/60 md:text-lg">
              Recursos curados sobre IA: herramientas, guias y tendencias para aplicar
              en estudio, trabajo y proyectos.
            </p>
          </header>

          <div className="mt-8">
            {posts.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {posts.map((post) => (
                  <BlogPostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <BlogEmptyState />
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
