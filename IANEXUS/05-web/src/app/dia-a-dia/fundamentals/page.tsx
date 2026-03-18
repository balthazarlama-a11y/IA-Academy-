import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import FundamentalsHero from "@/components/fundamentals/fundamentals-hero";
import FundamentalsPostCard from "@/components/fundamentals/fundamentals-post-card";
import FundamentalsToolCard from "@/components/fundamentals/fundamentals-tool-card";
import { fetchFundamentalsFeed } from "@/lib/repositories/fundamentals-repo";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export const revalidate = 300;

export default async function FundamentalsPage() {
  const { posts, tools } = await fetchFundamentalsFeed();

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f4f6fb] text-slate-900">
      <Header />

      <section className="relative mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 md:py-10">
        <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.16),_transparent_45%),radial-gradient(circle_at_top_right,_rgba(99,102,241,0.14),_transparent_40%),radial-gradient(circle_at_center,_rgba(148,163,184,0.12),_transparent_60%)] blur-3xl" />

        <div className="relative flex flex-col gap-6">
          <FundamentalsHero postsCount={posts.length} toolsCount={tools.length} />

          <section className="grid gap-4 lg:grid-cols-[1.12fr_0.88fr]">
            <Link
              href="/dia-a-dia"
              className="group rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:border-slate-300"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Día a Día</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">
                    Lectura rápida para arrancar hoy.
                  </h2>
                </div>
                <ArrowUpRight className="h-4 w-4 text-slate-400" />
              </div>
              <p className="mt-4 max-w-xl text-sm leading-6 text-slate-600">
                Esta vista compacta conecta el blog con tools curadas para moverte rápido sin perder contexto.
              </p>
              <div className="mt-5 flex items-center gap-2 text-sm font-medium text-slate-800">
                <span>Volver al feed principal</span>
                <ArrowUpRight className="h-4 w-4" />
              </div>
            </Link>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-[28px] border border-slate-200/80 bg-slate-950 p-5 text-white shadow-[0_18px_60px_rgba(15,23,42,0.14)]">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Lecturas</p>
                <p className="mt-3 text-4xl font-semibold">{posts.length}</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Posts listos para consumir en una sesión corta.
                </p>
              </div>
              <div className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Tools</p>
                <p className="mt-3 text-4xl font-semibold text-slate-950">{tools.length}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Herramientas que encajan con un flujo rápido y útil.
                </p>
              </div>
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-2">
            <section>
              <div className="mb-4 flex items-end justify-between gap-3 px-1">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Blog</p>
                  <h2 className="mt-1 text-2xl font-semibold tracking-[-0.02em] text-slate-950">
                    Lo nuevo en blogs
                  </h2>
                </div>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-500">
                  {posts.length} resultados
                </span>
              </div>
              {posts.length > 0 ? (
                <div className="grid gap-4">
                  {posts.map((post) => (
                    <FundamentalsPostCard key={post.id} post={post} />
                  ))}
                </div>
              ) : (
                <div className="rounded-[28px] border border-slate-200/80 bg-white p-5 text-sm text-slate-600 shadow-sm">
                  Aún no hay publicaciones recientes.
                </div>
              )}
            </section>

            <section>
              <div className="mb-4 flex items-end justify-between gap-3 px-1">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Tools</p>
                  <h2 className="mt-1 text-2xl font-semibold tracking-[-0.02em] text-slate-950">
                    Tools recomendadas del día
                  </h2>
                </div>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-500">
                  {tools.length} resultados
                </span>
              </div>
              {tools.length > 0 ? (
                <div className="grid gap-4">
                  {tools.map((tool) => (
                    <FundamentalsToolCard key={tool.id} tool={tool} />
                  ))}
                </div>
              ) : (
                <div className="rounded-[28px] border border-slate-200/80 bg-white p-5 text-sm text-slate-600 shadow-sm">
                  Aún no hay tools recomendadas para hoy.
                </div>
              )}
            </section>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
