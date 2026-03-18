import type { Metadata } from "next";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { CommunityCtaBanner } from "@/components/marketing/community-cta-banner";
import { TrackedWhatsAppLink } from "@/components/marketing/tracked-whatsapp-link";
import StudentsToolbar from "@/components/students/students-toolbar";
import { getToolsPage } from "@/lib/repositories/tools-repo";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Estudiantes | IA NEXUS",
  description:
    "Descubre herramientas de IA con acceso gratis, institucional o freemium para estudiar, investigar y avanzar mas rapido.",
};

export default async function EstudiantesPage() {
  const initialPage = await getToolsPage({ onlyFree: true }, { limit: 50, offset: 0 });

  return (
    <main className="relative flex min-h-screen flex-col">
      <Header />

      <section className="flex-1 w-full px-5 py-10 md:px-6 md:py-14 xl:px-8">
        <div className="editorial-frame">
          <header className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_54px_rgba(15,23,42,0.06)]">
            <div className="grid gap-6 p-5 md:p-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end lg:p-8">
              <div>
                <p className="inline-flex items-center rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-xs uppercase tracking-[0.16em] text-slate-600">
                  Hub para estudiantes
                </p>
                <h1
                  className="mt-4 text-3xl font-semibold leading-tight text-slate-900 md:text-4xl lg:text-[2.9rem]"
                >
                  Herramientas utiles para estudiar, investigar y avanzar rapido
                </h1>
                <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-600 md:text-base">
                  Compara acceso gratis, beneficio institucional y opciones freemium sin pasar por
                  una landing de descuentos. El foco aqui es encontrar que realmente sirve.
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-slate-200 pt-4">
                  <TrackedWhatsAppLink
                    location="estudiantes_header"
                    className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                      <path d="M20.52 3.48A11.83 11.83 0 0 0 12.05 0C5.57 0 .29 5.28.29 11.76c0 2.07.54 4.08 1.57 5.86L0 24l6.56-1.81a11.72 11.72 0 0 0 5.49 1.4h.01c6.48 0 11.76-5.28 11.76-11.76 0-3.14-1.22-6.1-3.3-8.35Zm-8.47 18.12h-.01a9.8 9.8 0 0 1-4.99-1.37l-.36-.21-3.89 1.08 1.04-3.79-.23-.39a9.76 9.76 0 0 1-1.5-5.16c0-5.41 4.41-9.82 9.84-9.82 2.62 0 5.09 1.02 6.95 2.89a9.75 9.75 0 0 1 2.88 6.94c0 5.42-4.41 9.83-9.83 9.83Z" />
                    </svg>
                    Comunidad de estudiantes
                  </TrackedWhatsAppLink>
                  <span className="text-sm text-slate-600">
                    Comparte beneficios, hallazgos y herramientas utiles con otros estudiantes.
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">
                  Como leer esta seleccion
                </p>
                <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-600">
                  <p>
                    <span className="font-semibold text-slate-900">Gratis total:</span> entra sin
                    pago ni tarjeta.
                  </p>
                  <p>
                    <span className="font-semibold text-slate-900">Beneficio institucional:</span>{" "}
                    acceso con correo institucional o verificacion academica.
                  </p>
                  <p>
                    <span className="font-semibold text-slate-900">Freemium:</span> prueba primero
                    y decide despues.
                  </p>
                </div>
              </div>
            </div>
          </header>

          <StudentsToolbar
            initialTools={initialPage.tools}
            initialHasMore={initialPage.hasMore}
            initialNextOffset={initialPage.nextOffset}
          />

          <div className="mt-10">
            <CommunityCtaBanner location="estudiantes_banner" />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
