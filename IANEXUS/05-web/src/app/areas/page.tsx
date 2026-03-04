import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import AreasToolbar from "@/components/areas/areas-toolbar";
import { getAreasToolsPage } from "@/lib/repositories/tools-repo";

export const revalidate = 300;

export default async function AreasPage() {
  const initialPage = await getAreasToolsPage({}, { limit: 50, offset: 0 });

  return (
    <main className="relative min-h-screen flex flex-col">
      <Header />

      <section className="flex-1 w-full px-6 py-10 md:py-14">
        <div className="mx-auto w-full max-w-7xl flex flex-col items-center gap-10">

          {/* Hero */}
          <div className="w-full text-center">
            <p className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.14em] text-white/65">
              Áreas
            </p>
            <h1
              className="mt-4 text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight"
              style={{
                backgroundImage: "linear-gradient(to right, #8b5cf6, #ec4899)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Herramientas por área
            </h1>
            <p className="mt-4 text-lg md:text-xl text-white/60 max-w-2xl mx-auto">
              Filtra por especialidad y encuentra las IAs más útiles para tu campo.
            </p>
          </div>

          {/* Toolbar + Grid (client-side) */}
          <AreasToolbar
            initialTools={initialPage.tools}
            initialHasMore={initialPage.hasMore}
            initialNextOffset={initialPage.nextOffset}
          />

        </div>
      </section>

      <Footer />
    </main>
  );
}
