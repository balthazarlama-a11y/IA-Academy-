import LiquidBackground from "@/components/backgrounds/liquid-background";
import TypewriterTitle from "@/components/home/typewriter-title";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { TrackedWhatsAppLink } from "@/components/marketing/tracked-whatsapp-link";
import PillarCards from "@/components/home/pillar-cards";

export default function Home() {
  return (
    <main className="relative grid min-h-screen grid-rows-[auto_1fr_auto] overflow-hidden">
      <LiquidBackground performanceMode="lite" />

      <div className="row-start-1">
        <Header />
      </div>

      <section className="row-start-2 flex items-center px-6 py-4 md:py-6">
        <div className="mx-auto grid w-full max-w-5xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="order-1 text-center lg:text-left">
            <TypewriterTitle
              text="Si solo usas ChatGPT, ya vas tarde"
              className="text-4xl font-semibold leading-tight tracking-tight md:text-5xl lg:text-6xl"
            />

            <p
              className="mx-auto mt-3 max-w-xl text-base md:text-lg lg:mx-0"
              style={{ color: "rgba(71,85,105,0.9)" }}
            >
              Descubre descuentos para estudiantes, herramientas para proyectos extra y
              oportunidades de IA que la mayoria todavia no esta usando.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {[
                "Planes .edu y descuentos detectados antes que el resto",
                "Herramientas para portafolio, freelance y proyectos extra",
                "WhatsApp con ideas utiles para no quedarte atras",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-slate-200/80 bg-white/85 px-4 py-3 text-sm text-slate-700 shadow-[0_8px_24px_rgba(15,23,42,0.06)]"
                >
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-center gap-3 lg:justify-start">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-blue-500 to-cyan-500 text-xs font-medium text-white"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <p className="text-sm text-slate-600">
                Entra al grupo y enterate antes que otros estudiantes de lo ultimo en IA.
              </p>
            </div>

            <div className="mt-6 flex flex-col items-center gap-3 lg:items-start">
              <TrackedWhatsAppLink
                location="hero"
                className="inline-flex items-center gap-3 rounded-full px-10 py-4 text-base font-semibold text-white transition-colors duration-150 md:text-lg"
                style={{
                  background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                  boxShadow: "0 12px 24px rgba(59,130,246,0.28)",
                  touchAction: "manipulation",
                }}
              >
                Entrar al grupo de WhatsApp
                <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M2 7h10M7 2l5 5-5 5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </TrackedWhatsAppLink>
              <p className="text-sm text-slate-500">
                Alertas de descuentos, herramientas nuevas y casos reales para proyectos extra.
              </p>
            </div>
          </div>

          <div className="order-2 flex w-full justify-center lg:justify-end">
            <PillarCards variant="stacked" />
          </div>
        </div>
      </section>

      <div className="row-start-3">
        <Footer />
      </div>
    </main>
  );
}
