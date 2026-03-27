import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import FundamentalsHero from "@/components/fundamentals/fundamentals-hero";
import FundamentalsPostCard from "@/components/fundamentals/fundamentals-post-card";
import FundamentalsToolCard from "@/components/fundamentals/fundamentals-tool-card";
import { fetchFundamentalsFeed } from "@/lib/repositories/fundamentals-repo";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Fundamentals | YourAI",
  description:
    "Selección compacta de lecturas y herramientas para revisar lo esencial de IA sin ruido ni exceso visual.",
};

export default async function FundamentalsPage() {
  const { posts, tools } = await fetchFundamentalsFeed();

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f4f6fb] text-slate-900">
      <Header />

      <section className="relative w-full px-4 py-6 sm:px-6 md:py-10">
        <div className="absolute inset-x-0 top-0 h-60 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.12),_transparent_42%),radial-gradient(circle_at_top_right,_rgba(99,102,241,0.10),_transparent_38%)] blur-3xl" />

        <div className="editorial-frame relative flex flex-col gap-5">
          <FundamentalsHero postsCount={posts.length} toolsCount={tools.length} />

          <section className="rounded-2xl border border-slate-200/80 bg-white/92 p-4 shadow-[0_12px_36px_rgba(15,23,42,0.05)] md:p-5">
            <div className="flex flex-col gap-4 border-b border-slate-200 pb-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Navegación</p>
                <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
                  Mantén el contexto, cambia la profundidad.
                </h2>
              </div>

              <Link
                href="/dia-a-dia"
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 transition hover:text-slate-950"
              >
                Volver al feed del día
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-5 grid gap-6 lg:grid-cols-2">
              <section>
                <div className="mb-4 flex items-end justify-between gap-3 px-1">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Lecturas</p>
                    <h2 className="mt-1 text-2xl font-semibold tracking-[-0.02em] text-slate-950">
                      Blog esencial
                    </h2>
                  </div>
                  <span className="text-sm text-slate-500">{posts.length} piezas</span>
                </div>
                {posts.length > 0 ? (
                  <div className="grid gap-4">
                    {posts.map((post) => (
                      <FundamentalsPostCard key={post.id} post={post} />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-slate-200/80 bg-white p-5 text-sm text-slate-600 shadow-sm">
                    Aún no hay publicaciones recientes.
                  </div>
                )}
              </section>

              <section>
                <div className="mb-4 flex items-end justify-between gap-3 px-1">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Herramientas</p>
                    <h2 className="mt-1 text-2xl font-semibold tracking-[-0.02em] text-slate-950">
                      Selección del día
                    </h2>
                  </div>
                  <span className="text-sm text-slate-500">{tools.length} piezas</span>
                </div>
                {tools.length > 0 ? (
                  <div className="grid gap-4">
                    {tools.map((tool) => (
                      <FundamentalsToolCard key={tool.id} tool={tool} />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-slate-200/80 bg-white p-5 text-sm text-slate-600 shadow-sm">
                    Aún no hay tools recomendadas para hoy.
                  </div>
                )}
              </section>
            </div>
          </section>
        </div>
      </section>

      <Footer />
    </main>
  );
}
