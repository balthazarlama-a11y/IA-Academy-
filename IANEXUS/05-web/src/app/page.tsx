import GlassFilter from "@/components/ui/glass-filter";
import LiquidBackground from "@/components/ui/liquid-background";
import Header from "@/components/ui/header";
import PillarCards from "@/components/ui/pillar-cards";
import Footer from "@/components/ui/footer";

export default function Home() {
  return (
    <main className="relative h-screen flex flex-col overflow-hidden">
      <GlassFilter />
      <LiquidBackground />

      <Header />

      {/* CENTER — hero + pilares */}
      <section className="flex-1 flex flex-col items-center justify-center gap-8 px-6 text-center">
        {/* Hero */}
        <div className="flex flex-col items-center gap-3">
          <h1
            className="text-5xl md:text-7xl font-bold max-w-2xl leading-tight tracking-tight"
            style={{ color: "rgba(255, 255, 255, 0.95)" }}
          >
            Descubre las IAs<br />que importan.
          </h1>
          <p
            className="text-base md:text-lg max-w-sm"
            style={{ color: "rgba(255, 255, 255, 0.55)" }}
          >
            Herramientas verificadas y comunidad para estudiantes.
          </p>
        </div>

        {/* 3 Pilares */}
        <PillarCards />

        {/* CTA único */}
        <a
          href="https://chat.whatsapp.com/tu-enlace-general"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:brightness-110"
          style={{
            background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
            boxShadow: "0 4px 20px rgba(139, 92, 246, 0.40)",
          }}
        >
          Entrar a la Comunidad
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </section>

      <Footer />
    </main>
  );
}
