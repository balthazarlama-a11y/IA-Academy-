import type { Metadata } from "next";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { CommunityCtaBanner } from "@/components/marketing/community-cta-banner";
import StudentsToolbar from "@/components/students/students-toolbar";
import { getToolsPage } from "@/lib/repositories/tools-repo";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Estudiantes | IA NEXUS",
  description:
    "Descubre herramientas de IA con acceso gratis, institucional o freemium para estudiar, investigar y avanzar más rápido.",
};

export default async function EstudiantesPage() {
  const initialPage = await getToolsPage({ onlyFree: true }, { limit: 50, offset: 0 });

  return (
    <main className="relative flex min-h-screen flex-col">
      <Header />

      <section className="flex-1 w-full px-5 py-10 md:px-6 md:py-14 xl:px-8">
        <div className="editorial-frame">
          <header className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_54px_rgba(15,23,42,0.06)]">
            <div className="p-5 md:p-6 lg:p-8">
              <p className="inline-flex items-center rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-xs uppercase tracking-[0.16em] text-slate-600">
                Hub para estudiantes
              </p>
              <h1 className="mt-4 max-w-4xl text-3xl font-semibold leading-tight text-slate-900 md:text-4xl lg:text-[2.9rem]">
                Encuentra herramientas útiles sin navegar una landing de descuentos
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-600 md:text-base">
                Empieza por acceso: gratis total, beneficio institucional o freemium. Lo demás
                queda como ajuste fino.
              </p>
            </div>
          </header>

          <StudentsToolbar
            initialTools={initialPage.tools}
            initialHasMore={initialPage.hasMore}
            initialNextOffset={initialPage.nextOffset}
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
