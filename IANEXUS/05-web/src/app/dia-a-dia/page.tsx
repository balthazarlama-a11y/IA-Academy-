import Link from "next/link";
import { ArrowUpRight, BookOpen, Sparkles } from "lucide-react";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import DayFeedLayout from "@/components/day-to-day/day-feed-layout";
import { fetchPublishedPosts } from "@/lib/supabase/server";
import { getToolsPage } from "@/lib/repositories/tools-repo";

export const revalidate = 300;

export default async function DiaADiaPage() {
  const [postsData, toolsData] = await Promise.all([
    fetchPublishedPosts(),
    getToolsPage({}, { limit: 50, offset: 0 }),
  ]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f4f6fb] text-slate-900">
      <Header />

      <section className="relative flex-1 px-4 py-6 sm:px-6 md:py-10">
        <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.14),_transparent_45%),radial-gradient(circle_at_top_right,_rgba(99,102,241,0.12),_transparent_40%),radial-gradient(circle_at_center,_rgba(148,163,184,0.1),_transparent_60%)] blur-3xl" />

        <div className="editorial-frame relative flex flex-col gap-5">
          <header className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/88 p-4 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur md:p-5">
            <div className="grid gap-6 lg:grid-cols-[1.12fr_0.88fr] lg:items-center">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
                  <Sparkles className="h-3.5 w-3.5 text-cyan-500" />
                  Feed editorial
                </p>

                <h1 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight tracking-[-0.03em] text-slate-950 md:text-4xl">
                  Lo que vale la pena ver hoy en IA.
                </h1>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
                  Posts, tools y lecturas rápidas para descubrir qué usar, cómo usarlo y por qué importa en tu flujo real.
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Link
                    href="/dia-a-dia/fundamentals"
                    className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
                  >
                    Abrir fundamentals
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    Ver blog completo
                    <BookOpen className="h-4 w-4" />
                  </Link>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-500">Posts publicados</span>
                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-500">Tools activas</span>
                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-500">Curación diaria</span>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                <div className="rounded-xl border border-slate-200 bg-slate-950 p-4 text-white shadow-[0_12px_28px_rgba(15,23,42,0.16)]">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Posts</p>
                  <p className="mt-3 text-3xl font-semibold">{postsData.length}</p>
                  <p className="mt-2 text-sm text-slate-300">Lecturas publicadas listas para abrir.</p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Tools</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-950">{toolsData.tools.length}</p>
                  <p className="mt-2 text-sm text-slate-600">Herramientas y packs que pueden entrar en tu flujo hoy.</p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Sistema</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-950">2</p>
                  <p className="mt-2 text-sm text-slate-600">Dos vistas que comparten la misma lógica editorial.</p>
                </div>
              </div>
            </div>
          </header>

          <DayFeedLayout posts={postsData} tools={toolsData.tools} />
        </div>
      </section>

      <Footer />
    </main>
  );
}
