import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import StudentsToolbar from "@/components/students/students-toolbar";
import { getToolsPage } from "@/lib/repositories/tools-repo";

export const revalidate = 300;

export default async function EstudiantesPage() {
  const initialPage = await getToolsPage({ onlyFree: true }, { limit: 50, offset: 0 });

  return (
    <main className="relative min-h-screen flex flex-col">
      <Header />

      <section className="flex-1 w-full px-6 py-10 md:py-14">
        <div className="mx-auto w-full max-w-6xl">
          <header className="rounded-3xl border border-white/15 bg-white/[0.07] p-6 md:p-8 backdrop-blur-2xl">
            <p className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.14em] text-white/65">
              Estudiantes
            </p>
            <h1
              className="mt-4 text-4xl font-semibold leading-tight md:text-5xl"
              style={{
                backgroundImage: "linear-gradient(to right, #00d9ff, #a78bfa)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Oportunidades gratis para tu carrera
            </h1>
            <p className="mt-3 max-w-3xl text-base text-white/65 md:text-lg">
              Encuentra herramientas con plan gratis o beneficios educativos. Activa
              freemium solo cuando quieras ampliar la busqueda.
            </p>
          </header>

          <StudentsToolbar
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
