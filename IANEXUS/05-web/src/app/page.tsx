import LiquidBackground from "@/components/backgrounds/liquid-background";
import Header from "@/components/layout/header";
import PillarCards from "@/components/home/pillar-cards";
import Footer from "@/components/layout/footer";
import TypewriterTitle from "@/components/home/typewriter-title";
import { TrackedWhatsAppLink } from "@/components/marketing/tracked-whatsapp-link";

export default function Home() {
  return (
    <main className="relative min-h-screen grid grid-rows-[auto_1fr_auto] overflow-hidden">
      <LiquidBackground performanceMode="lite" />

      <div className="row-start-1">
        <Header />
      </div>

      <section className="row-start-2 flex items-center px-6 py-4 md:py-6">
        <div className="mx-auto grid w-full max-w-5xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="order-1 text-center lg:text-left">
            <TypewriterTitle
              text="Descubre las IAs que importan"
              className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight tracking-tight"
            />

            <p
              className="mt-3 max-w-xl text-base md:text-lg mx-auto lg:mx-0"
              style={{ color: "rgba(71,85,105,0.9)" }}
            >
              Herramientas verificadas con plan .edu gratis, prompts para tu carrera y 
              una comunidad de estudiantes que te ayuda en tiempo real.
            </p>

            {/* Prueba social */}
            <div className="mt-4 flex items-center justify-center lg:justify-start gap-3">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xs text-white font-medium"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <p className="text-sm text-slate-600">
                <span className="font-semibold text-slate-800">+500 estudiantes</span> de 15 carreras ya participan
              </p>
            </div>

            <div className="mt-6 flex justify-center lg:justify-start">
              <TrackedWhatsAppLink
                location="hero"
                className="inline-flex items-center gap-3 px-10 py-4 rounded-full text-base md:text-lg font-semibold text-white transition-colors duration-150"
                style={{
                  background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                  boxShadow: "0 12px 24px rgba(59,130,246,0.28)",
                  touchAction: "manipulation",
                }}
              >
                Únete a la comunidad
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
            </div>
          </div>

          <div className="order-2 w-full flex justify-center lg:justify-end">
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
