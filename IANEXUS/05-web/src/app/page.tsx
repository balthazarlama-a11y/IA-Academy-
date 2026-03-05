import LiquidBackground from "@/components/backgrounds/liquid-background";
import LatestUpdatesSection from "@/components/blog/latest-updates-section";
import PillarCards from "@/components/home/pillar-cards";
import TypewriterTitle from "@/components/home/typewriter-title";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { TrackedWhatsAppLink } from "@/components/marketing/tracked-whatsapp-link";
import { fetchPublishedNews } from "@/lib/supabase/server";

export default async function Home() {
  const latestNews = await fetchPublishedNews(3);
  const valuePoints = [
    "Descuentos y beneficios .edu que si conviene activar.",
    "Tools para proyectos extra, portafolio y freelance.",
    "Casos y novedades para no quedarte atras usando solo ChatGPT.",
  ];

  return (
    <main className="relative grid min-h-screen grid-rows-[auto_1fr_auto_auto] overflow-hidden">
      <LiquidBackground performanceMode="lite" />

      <div className="row-start-1">
        <Header />
      </div>

      <section className="row-start-2 flex items-center px-6 py-4 md:py-6">
        <div className="mx-auto grid w-full max-w-5xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="order-1 text-center lg:text-left">
            <p className="inline-flex items-center rounded-full border border-slate-200 bg-white/90 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-slate-600 shadow-[0_8px_18px_rgba(15,23,42,0.06)]">
              V1 para estudiantes que quieren moverse rapido
            </p>

            <TypewriterTitle
              text="Si solo usas ChatGPT, te estas quedando atras"
              gradient
              className="mt-4 text-4xl font-semibold leading-tight tracking-tight md:text-5xl lg:text-6xl"
            />

            <p
              className="mx-auto mt-4 max-w-2xl text-base md:text-lg lg:mx-0"
              style={{ color: "rgba(71,85,105,0.9)" }}
            >
              Descubre que herramientas realmente valen la pena, cuales tienen descuentos o plan
              .edu y como usarlas para avanzar mas rapido en proyectos, portafolio y trabajo extra.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {valuePoints.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3 text-sm leading-relaxed text-slate-700 shadow-[0_10px_26px_rgba(15,23,42,0.06)]"
                >
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-center justify-center gap-3 lg:justify-start">
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
                Estudiantes compartiendo descuentos, tools y casos utiles por WhatsApp.
              </p>
            </div>

            <div className="mt-7 flex flex-col items-center gap-3 lg:items-start">
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

              <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-slate-500 lg:justify-start">
                <span className="rounded-full border border-slate-200 bg-white/80 px-3 py-1">
                  Descuentos .edu
                </span>
                <span className="rounded-full border border-slate-200 bg-white/80 px-3 py-1">
                  Tools para portafolio
                </span>
                <span className="rounded-full border border-slate-200 bg-white/80 px-3 py-1">
                  Novedades sin ruido
                </span>
              </div>
            </div>
          </div>

          <div className="order-2 flex w-full justify-center lg:justify-end">
            <PillarCards variant="stacked" />
          </div>
        </div>
      </section>

      {latestNews.length > 0 ? (
        <section className="row-start-3 px-6 pb-10 md:pb-14">
          <div className="mx-auto w-full max-w-5xl">
            <LatestUpdatesSection
              posts={latestNews}
              title="Lo ultimo en IA, sin ruido"
              subtitle="Updates breves para detectar que salio, que cambio y que vale la pena mirar hoy."
            />
          </div>
        </section>
      ) : null}

      <div className={latestNews.length > 0 ? "row-start-4" : "row-start-3"}>
        <Footer />
      </div>
    </main>
  );
}
