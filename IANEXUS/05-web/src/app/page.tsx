import LiquidBackground from "@/components/ui/liquid-background";
import Header from "@/components/ui/header";
import PillarCards from "@/components/ui/pillar-cards";
import Footer from "@/components/ui/footer";

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col">
      <LiquidBackground />

      <Header />

      <section className="flex-1 flex flex-col items-center justify-center gap-8 px-6 py-12">
        <h1
          className="text-4xl md:text-5xl font-semibold text-center max-w-2xl leading-tight"
          style={{
            backgroundImage:
              "linear-gradient(to right, #ffffff, #bfdbfe, #ddd6fe)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Descubre las IAs que importan.
        </h1>

        <p className="text-lg text-white/60 text-center max-w-lg">
          Herramientas, planes gratis y comunidad por área.
        </p>

        <PillarCards />
      </section>

      <Footer />
    </main>
  );
}
