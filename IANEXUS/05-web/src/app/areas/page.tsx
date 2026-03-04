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

      <section className="flex-1 flex flex-col items-center gap-10 px-6 py-16">

        {/* Hero */}
        <div className="w-full max-w-5xl text-center">
          <h1
            className="text-4xl md:text-5xl font-semibold mb-4 leading-tight"
            style={{
              backgroundImage: "linear-gradient(to right, #8b5cf6, #ec4899)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Herramientas por área
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Filtra por especialidad y encuentra las IAs más útiles para tu campo.
          </p>
        </div>

        {/* Toolbar + Grid (client-side) */}
        <AreasToolbar
          initialTools={initialPage.tools}
          initialHasMore={initialPage.hasMore}
          initialNextOffset={initialPage.nextOffset}
        />

      </section>

      <Footer />
    </main>
  );
}
