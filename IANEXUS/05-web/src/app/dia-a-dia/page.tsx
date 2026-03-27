import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, BookOpen } from "lucide-react";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import DayFeedLayout from "@/components/day-to-day/day-feed-layout";
import { fetchPublishedPosts } from "@/lib/supabase/server";
import { getToolsPage } from "@/lib/repositories/tools-repo";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Día a Día | YourAI",
  description:
    "Feed editorial diario de YourAI con lecturas y herramientas para decidir qué vale la pena abrir hoy.",
};

export default async function DiaADiaPage() {
  const [postsData, toolsData] = await Promise.all([
    fetchPublishedPosts(),
    getToolsPage({}, { limit: 50, offset: 0 }),
  ]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f4f1eb_0%,#faf8f4_45%,#ffffff_100%)] text-slate-900">
      <Header />

      <section className="relative flex-1 px-4 py-6 sm:px-6 md:py-10">
        <div className="absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_top_left,_rgba(45,75,207,0.08),_transparent_40%),radial-gradient(circle_at_top_right,_rgba(99,102,241,0.06),_transparent_36%)] blur-3xl" />

        <div className="editorial-frame relative flex flex-col gap-5">
          <header className="rounded-[1.45rem] border border-slate-300/70 bg-white/94 p-5 shadow-[0_16px_34px_rgba(17,24,39,0.06)] backdrop-blur md:p-6">
            <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="ui-label">
                  Feed editorial
                </p>

                <h1 className="ui-title mt-2 max-w-3xl text-[2.45rem] leading-[0.94] text-slate-950 md:text-[3.4rem]">
                  Lo útil para abrir hoy en IA.
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 md:text-base">
                  Una vista compacta con lecturas y herramientas para revisar rápido qué cambió,
                  qué merece atención y qué puedes usar hoy.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/dia-a-dia/fundamentals"
                  className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  Abrir fundamentals
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300/70 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                >
                  Ver archivo
                  <BookOpen className="h-4 w-4" />
                </Link>
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
