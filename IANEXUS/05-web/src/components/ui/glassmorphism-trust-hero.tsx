import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Sparkles,
  GraduationCap,
  Layers3,
  MessageCircle,
} from "lucide-react";
import NeuralBackground from "@/components/ui/neural-background";

const PILLARS = [
  {
    title: "Gratis para Estudiantes",
    subtitle: "Planes edu + herramientas sin costo",
    description:
      "Descubre plataformas con beneficios reales para .edu y guías de activación paso a paso.",
    icon: GraduationCap,
    href: "#estudiantes",
    accent: "from-emerald-300/70 to-emerald-500/70",
  },
  {
    title: "Áreas y Especialidades",
    subtitle: "Salud, programación, diseño y más",
    description:
      "Encuentra la IA adecuada según tu disciplina, nivel y presupuesto.",
    icon: Layers3,
    href: "#areas",
    accent: "from-cyan-300/70 to-blue-500/70",
  },
  {
    title: "IA del Día a Día",
    subtitle: "Prompts prácticos y automatización útil",
    description:
      "Flujos rápidos para estudiar mejor, resumir, planificar y producir más en menos tiempo.",
    icon: Sparkles,
    href: "#dia-a-dia",
    accent: "from-violet-300/70 to-fuchsia-500/70",
  },
];

export default function GlassmorphismTrustHero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-zinc-950 text-white">
      <div className="absolute inset-0 z-0">
        <NeuralBackground
          color="#8b5cf6"
          particleCount={650}
          trailOpacity={0.11}
          speed={1}
          className="opacity-80"
        />
      </div>

      <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_12%_20%,rgba(56,189,248,.24),transparent_32%),radial-gradient(circle_at_80%_8%,rgba(167,139,250,.20),transparent_35%),radial-gradient(circle_at_82%_88%,rgba(16,185,129,.16),transparent_34%)]" />

      <div className="relative z-20 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-8 sm:px-10 lg:px-12">
        <header className="mb-8 flex items-center justify-between rounded-2xl border border-white/15 bg-white/5 px-4 py-3 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/90 text-zinc-900 shadow-lg">
              <BookOpen className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-300">Comunidad IA</p>
              <p className="text-sm font-semibold tracking-wide">IA NEXUS</p>
            </div>
          </div>

          <Link
            href="https://chat.whatsapp.com/tu-enlace-general"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-emerald-300/40 bg-emerald-400/20 px-4 py-2 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-400/30"
          >
            <MessageCircle className="h-4 w-4" />
            Entrar a comunidad
          </Link>
        </header>

        <main className="grid flex-1 gap-8 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.16em] text-zinc-200">
              <Sparkles className="h-3.5 w-3.5" />
              Plataforma informativa
            </p>

            <h1 className="max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              IA curada para aprender,
              <span className="bg-gradient-to-r from-cyan-200 via-violet-200 to-emerald-200 bg-clip-text text-transparent">
                {" "}
                aplicar y crecer en comunidad.
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-zinc-300 sm:text-lg">
              Sin humo. Sin ruido. Solo herramientas verificadas, planes gratis,
              prompts útiles y tendencias que sí importan para estudiantes y
              profesionales.
            </p>
          </div>

          <div className="grid gap-4">
            {PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <Link
                  key={pillar.title}
                  href={pillar.href}
                  className="group relative overflow-hidden rounded-3xl border border-white/15 bg-white/[0.08] p-5 backdrop-blur-2xl transition hover:-translate-y-1 hover:border-white/30 hover:bg-white/[0.12]"
                >
                  <div
                    className={`pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${pillar.accent}`}
                  />

                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/15">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h2 className="text-xl font-semibold tracking-tight">{pillar.title}</h2>
                  <p className="mt-1 text-sm font-medium text-zinc-200">{pillar.subtitle}</p>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-300">{pillar.description}</p>

                  <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white/90">
                    Explorar
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </main>
      </div>
    </section>
  );
}
