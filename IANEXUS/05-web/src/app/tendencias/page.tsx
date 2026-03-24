import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Layers3, Sparkles } from "lucide-react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { EditorialSectionHeader } from "@/components/home/editorial-section-header";
import { TrendingToolCard } from "@/components/trending/trending-tool-card";
import { getTrendingSurfaceData } from "@/lib/repositories/trending-repo";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Tendencias | IA NEXUS",
  description:
    "Una primera superficie editorial para revisar las herramientas de IA que hoy merecen más atención en IA NEXUS.",
};

export default async function TendenciasPage() {
  const trending = await getTrendingSurfaceData();

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f5f2ec] text-slate-950">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[24rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.7)_0%,rgba(245,242,236,0.98)_52%,rgba(245,242,236,1)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[20rem] bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.08),transparent_38%)]" />

      <div className="relative z-10">
        <Header />

        <section className="editorial-frame px-4 py-6 md:px-6 md:py-10 xl:px-8">
          <div className="flex flex-col gap-5">
            <div className="rounded-2xl border border-slate-200 bg-white/92 p-5 shadow-[0_14px_42px_rgba(15,23,42,0.06)] md:p-6">
              <div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-end">
                <div>
                  <p className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-slate-600">
                    <Sparkles className="h-3.5 w-3.5 text-sky-600" />
                    Tendencia editorial
                  </p>

                  <h1 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight tracking-[-0.03em] text-slate-950 md:text-4xl lg:text-[2.95rem] lg:leading-[1]">
                    Lo que vale la pena revisar ahora en IA.
                  </h1>

                  <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 md:text-[15px]">
                    Esta es una primera superficie de tendencias con una mezcla editorial: herramientas
                    destacadas, entradas recientes, enlaces a guías y señales de calidad ya existentes.
                    No depende de personalización ni de popularidad ficticia.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-600">
                      Orden editorial, no leaderboard vacío
                    </span>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-600">
                      Señales existentes y fáciles de evolucionar
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">
                    Cómo se ordena
                  </p>
                  <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-600">
                    <p>1. Pesan primero las herramientas destacadas y las que ya tienen guía.</p>
                    <p>2. La frescura y la verificación ayudan a desempatar.</p>
                    <p>3. `sort_order` y fecha solo afinan el orden final.</p>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
                    Destacadas
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">
                    {trending.stats.featuredCount}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">Tienen peso manual en la selección.</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
                    Con guía
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">
                    {trending.stats.guideCount}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">Ya tienen lectura asociada.</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
                    Recientes
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">
                    {trending.stats.recentCount}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">Entraron en los últimos 45 días.</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
                    Con señal de calidad
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">
                    {trending.stats.verifiedCount}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">Verificadas o aptas para estudiantes.</p>
                </div>
              </div>
            </div>

            <section className="editorial-frame">
              <EditorialSectionHeader
                eyebrow="Ranking editorial"
                title="Las herramientas que suben ahora"
                description="La primera pasada junta frescura, guía, featured y señales de calidad. El número de cada tarjeta indica su lugar en la mezcla editorial de hoy."
              />

              <div className="mt-4 grid gap-3 lg:grid-cols-2">
                {trending.rankedTools.length > 0 ? (
                  trending.rankedTools.map((tool, index) => (
                    <TrendingToolCard key={tool.id} tool={tool} rank={index + 1} />
                  ))
                ) : (
                  <div className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-[0_6px_16px_rgba(15,23,42,0.035)]">
                    Aún no hay suficientes herramientas publicadas para armar la primera lectura de
                    tendencias.
                  </div>
                )}
              </div>
            </section>

            <section className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white/92 p-4 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Lo reciente
                    </p>
                    <h2 className="mt-1 text-lg font-semibold tracking-tight text-slate-950">
                      Revisa lo nuevo con contexto
                    </h2>
                  </div>
                  <Link
                    href="/areas"
                    className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-white"
                  >
                    Explorar catálogo
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="mt-4 grid gap-3">
                  {trending.recentTools.length > 0 ? (
                    trending.recentTools.map((tool, index) => (
                      <TrendingToolCard
                        key={tool.id}
                        tool={tool}
                        rank={trending.rankedTools.length + index + 1}
                        compact
                      />
                    ))
                  ) : (
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                      No hay herramientas recientes suficientes para mostrar esta vista por ahora.
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white/92 p-4 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Guías vinculadas
                    </p>
                    <h2 className="mt-1 text-lg font-semibold tracking-tight text-slate-950">
                      Herramientas con lectura editorial
                    </h2>
                  </div>
                  <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-white"
                  >
                    Ver blog
                    <BookOpen className="h-4 w-4" />
                  </Link>
                </div>

                <div className="mt-4 grid gap-3">
                  {trending.guideTools.length > 0 ? (
                    trending.guideTools.map((tool, index) => (
                      <TrendingToolCard
                        key={tool.id}
                        tool={tool}
                        rank={trending.rankedTools.length + trending.recentTools.length + index + 1}
                        compact
                      />
                    ))
                  ) : (
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                      Aún no hay herramientas con guía enlazada para destacar en esta sección.
                    </div>
                  )}
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-slate-950 px-5 py-6 text-white shadow-[0_12px_28px_rgba(15,23,42,0.14)] md:px-6 md:py-7">
              <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <p className="inline-flex items-center rounded-md border border-white/15 bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-300">
                    Nota editorial
                  </p>
                  <h2 className="mt-3 max-w-2xl text-xl font-semibold tracking-tight md:text-[2rem]">
                    La tendencia aquí es una mezcla de criterio editorial y señales existentes.
                  </h2>
                  <p className="mt-2 max-w-2xl text-[0.92rem] leading-6 text-slate-300">
                    {trending.editorialNote}
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                  <Link
                    href="/estudiantes"
                    className="inline-flex items-center justify-center rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 transition-opacity hover:opacity-90"
                  >
                    Ver opciones para estudiantes
                    <Layers3 className="ml-2 h-4 w-4" />
                  </Link>
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                  >
                    Volver a portada
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  );
}
