import type { Metadata } from "next";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { CommunityCtaBanner } from "@/components/marketing/community-cta-banner";
import StudentsToolbar from "@/components/students/students-toolbar";
import { getToolsPage } from "@/lib/repositories/tools-repo";
import { getUseCases } from "@/lib/repositories/tool-taxonomy-repo";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Estudiantes | YourAI",
  description:
    "Descubre herramientas de IA con acceso gratis, institucional o freemium para estudiar, investigar y avanzar mas rapido.",
};

export default async function EstudiantesPage() {
  const [initialPage, useCases] = await Promise.all([
    getToolsPage({ onlyFree: true }, { limit: 50, offset: 0 }),
    getUseCases(),
  ]);

  return (
    <main className="relative flex min-h-screen flex-col bg-[linear-gradient(180deg,#f5f2ec_0%,#faf8f4_45%,#ffffff_100%)]">
      <Header />

      <section className="flex-1 w-full px-5 py-8 md:px-6 md:py-10 xl:px-8">
        <div className="editorial-frame flex flex-col gap-6">
          <header className="overflow-hidden rounded-[1.5rem] ui-shell">
            <div className="border-b ui-rule bg-[linear-gradient(180deg,rgba(247,243,236,0.8)_0%,rgba(255,255,255,0.95)_100%)] px-5 py-5 md:px-6 md:py-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div className="max-w-3xl">
                  <p className="inline-flex items-center gap-2 rounded-full border border-slate-300/50 bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-700">
                    Curaduría estudiantil
                  </p>
                  <h1 className="ui-title mt-3 text-[2rem] leading-[0.98] text-slate-950 md:text-[3rem]">
                    Encuentra acceso útil sin navegar una landing de descuentos.
                  </h1>
                  <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-slate-600 md:text-sm">
                    Primero filtras por acceso real. Después ajustas por tipo de IA. La idea es
                    llegar rápido a herramientas que puedas usar hoy.
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-300/70 bg-white px-3 py-1.5 text-[11px] text-slate-600 shadow-[0_6px_14px_rgba(17,24,39,0.04)] md:px-4 md:py-2 md:text-xs">
                  <span className="font-semibold text-slate-950">{initialPage.tools.length}</span>
                  herramientas iniciales
                </div>
              </div>
            </div>
          </header>

          <StudentsToolbar
            initialTools={initialPage.tools}
            initialHasMore={initialPage.hasMore}
            initialNextOffset={initialPage.nextOffset}
            useCases={useCases}
          />

          <div className="mt-8">
            <CommunityCtaBanner location="estudiantes_banner" />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
