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
    <main className="min-h-screen bg-[#f5f7fb] text-slate-900">
      <Header />

      <section className="mx-auto w-full max-w-6xl px-6 py-10 md:py-14">
        <FundamentalsHero />

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-slate-900">Lo nuevo en blogs</h2>
            </div>
            {posts.length > 0 ? (
              <div className="grid gap-4">
                {posts.map((post) => (
                  <FundamentalsPostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
                Aún no hay publicaciones recientes.
              </div>
            )}
          </section>

          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-slate-900">Tools recomendadas del día</h2>
            </div>
            {tools.length > 0 ? (
              <div className="grid gap-4">
                {tools.map((tool) => (
                  <FundamentalsToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
                Aún no hay tools recomendadas para hoy.
              </div>
            )}
          </section>
        </div>
      </section>

      <Footer />
    </main>
  );
}

