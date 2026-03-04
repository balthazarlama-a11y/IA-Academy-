import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import DayFeedLayout from "@/components/day-to-day/day-feed-layout";
import { fetchPublishedPosts } from "@/lib/supabase/server";
import { getToolsPage } from "@/lib/repositories/tools-repo";

export const revalidate = 300;

export default async function DiaADiaPage() {
  // Fetch both posts and tools in parallel
  const [postsData, toolsData] = await Promise.all([
    fetchPublishedPosts(),
    getToolsPage({}, { limit: 50, offset: 0 }),
  ]);

  return (
    <main className="relative min-h-screen flex flex-col" style={{ background: "#f5f7fb" }}>
      <Header />

      <section className="flex-1 w-full px-6 py-10 md:py-14">
        <div className="mx-auto w-full max-w-7xl">
          {/* Hero */}
          <header className="mb-8 text-center">
            <p className="inline-flex items-center rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-xs uppercase tracking-[0.14em] text-slate-600">
              Día a Día
            </p>
            <h1
              className="mt-4 text-4xl md:text-5xl font-semibold leading-tight"
              style={{
                backgroundImage: "linear-gradient(to right, #0284c7, #6366f1)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              IA para tu día a día
            </h1>
            <p className="mt-3 max-w-2xl mx-auto text-base text-slate-600 md:text-lg">
              Descubre posts y herramientas organizadas para potenciar tu productividad diaria.
            </p>
          </header>

          {/* Split feed layout */}
          <DayFeedLayout posts={postsData} tools={toolsData.tools} />
        </div>
      </section>

      <Footer />
    </main>
  );
}

