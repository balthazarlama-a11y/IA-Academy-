import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import FundamentalsHero from "@/components/fundamentals/fundamentals-hero";
import FundamentalsPostCard from "@/components/fundamentals/fundamentals-post-card";
import FundamentalsToolCard from "@/components/fundamentals/fundamentals-tool-card";
import { fetchFundamentalsFeed } from "@/lib/repositories/fundamentals-repo";

export const revalidate = 300;

export default async function FundamentalsPage() {
  const { posts, tools } = await fetchFundamentalsFeed();

  return (
    <main className="min-h-screen bg-[#09090f] text-white">
      <Header />

      <section className="mx-auto w-full max-w-6xl px-6 py-10 md:py-14">
        <FundamentalsHero />

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-white">Lo nuevo en blogs</h2>
            </div>
            {posts.length > 0 ? (
              <div className="grid gap-4">
                {posts.map((post) => (
                  <FundamentalsPostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-white/12 bg-white/[0.04] p-5 text-sm text-white/60">
                Aun no hay publicaciones recientes.
              </div>
            )}
          </section>

          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-white">Tools recomendadas del dia</h2>
            </div>
            {tools.length > 0 ? (
              <div className="grid gap-4">
                {tools.map((tool) => (
                  <FundamentalsToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-white/12 bg-white/[0.04] p-5 text-sm text-white/60">
                Aun no hay tools recomendadas para hoy.
              </div>
            )}
          </section>
        </div>
      </section>

      <Footer />
    </main>
  );
}
