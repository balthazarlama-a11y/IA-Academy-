import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { CommunityCtaBanner } from "@/components/marketing/community-cta-banner";
import StudentsToolbar from "@/components/students/students-toolbar";
import { getToolsPage } from "@/lib/repositories/tools-repo";

export const revalidate = 300;

export default async function EstudiantesPage() {
  const initialPage = await getToolsPage({ onlyFree: true }, { limit: 50, offset: 0 });

  return (
    <main className="relative flex min-h-screen flex-col">
      <Header />

      <section className="flex-1 w-full px-6 py-10 md:py-14">
        <div className="mx-auto w-full max-w-7xl">
          <header className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8">
            <p className="inline-flex items-center rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-xs uppercase tracking-[0.14em] text-slate-600">
              Estudiantes
            </p>
            <h1
              className="mt-4 text-4xl font-semibold leading-tight md:text-5xl"
              style={{
                backgroundImage: "linear-gradient(to right, #2563eb, #7c3aed)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Herramientas y descuentos para estudiantes que si quieren avanzar
            </h1>
            <p className="mt-3 max-w-3xl text-base text-slate-600 md:text-lg">
              Encuentra herramientas con beneficios educativos, planes gratis y opciones
              utiles para proyectos extra antes de que se vuelvan masivas.
            </p>
          </header>

          <StudentsToolbar
            initialTools={initialPage.tools}
            initialHasMore={initialPage.hasMore}
            initialNextOffset={initialPage.nextOffset}
          />

          <div className="mt-10">
            <CommunityCtaBanner
              location="estudiantes_banner"
              subtitle="Entra al grupo para enterarte de descuentos, herramientas para proyectos extra y oportunidades de IA antes que otros estudiantes."
            />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
