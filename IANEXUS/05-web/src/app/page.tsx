import Link from "next/link";
import LiquidBackground from "@/components/backgrounds/liquid-background";
import PillarCards from "@/components/home/pillar-cards";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { TrackedWhatsAppLink } from "@/components/marketing/tracked-whatsapp-link";

type HomeIconProps = {
  className?: string;
};

function IconSummary({ className }: HomeIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 5h12" />
      <path d="M6 10h12" />
      <path d="M6 15h8" />
      <path d="M6 19h6" />
    </svg>
  );
}

function IconResearch({ className }: HomeIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="11" cy="11" r="6" />
      <path d="M20 20l-4.2-4.2" />
    </svg>
  );
}

function IconPresentation({ className }: HomeIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="4" y="5" width="16" height="10" rx="2" />
      <path d="M12 15v4" />
      <path d="M8 19h8" />
    </svg>
  );
}

function IconStudy({ className }: HomeIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 8l9-4 9 4-9 4-9-4z" />
      <path d="M7 10v4c0 1.6 2.2 3 5 3s5-1.4 5-3v-4" />
    </svg>
  );
}

function IconProductivity({ className }: HomeIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3v18" />
      <path d="M3 12h18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}

function IconIdeas({ className }: HomeIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M8.5 14.5A5.5 5.5 0 1115.5 14c-.8.7-1.5 1.8-1.5 3h-4c0-1.2-.7-2.1-1.5-2.5z" />
    </svg>
  );
}

function IconHealth({ className }: HomeIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 4v16" />
      <path d="M8 8h8" />
      <path d="M8 16h8" />
    </svg>
  );
}

function IconEngineering({ className }: HomeIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3l2.5 2.5-1.5 2.5 1.5 2.5-1.5 2.5 1.5 2.5L12 21l-2.5-2.5 1.5-2.5-1.5-2.5 1.5-2.5-1.5-2.5L12 3z" />
    </svg>
  );
}

function IconLaw({ className }: HomeIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 5v14" />
      <path d="M6 8h12" />
      <path d="M7 8l-2 4h4l-2-4z" />
      <path d="M17 8l-2 4h4l-2-4z" />
    </svg>
  );
}

function IconDesign({ className }: HomeIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="8" cy="8" r="3" />
      <circle cx="16" cy="8" r="3" />
      <circle cx="8" cy="16" r="3" />
      <path d="M13 16h5" />
    </svg>
  );
}

function IconBusiness({ className }: HomeIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="4" y="7" width="16" height="11" rx="2" />
      <path d="M9 7V5h6v2" />
      <path d="M4 12h16" />
    </svg>
  );
}

function IconEducation({ className }: HomeIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 8l9-4 9 4-9 4-9-4z" />
      <path d="M6 10v4c0 1.4 2.7 2.8 6 2.8s6-1.4 6-2.8v-4" />
    </svg>
  );
}

const useCases = [
  { label: "Resumir", icon: IconSummary },
  { label: "Investigar", icon: IconResearch },
  { label: "Presentaciones", icon: IconPresentation },
  { label: "Estudiar", icon: IconStudy },
  { label: "Productividad", icon: IconProductivity },
  { label: "Organizar ideas", icon: IconIdeas },
];

const areas = [
  { label: "Salud", href: "/areas?area=salud", icon: IconHealth },
  { label: "Ingenieria", href: "/areas?area=programacion", icon: IconEngineering },
  { label: "Derecho", href: "/areas?area=investigacion", icon: IconLaw },
  { label: "Diseno", href: "/areas?area=diseno", icon: IconDesign },
  { label: "Negocios", href: "/areas?area=escritura", icon: IconBusiness },
  { label: "Educacion", href: "/dia-a-dia/fundamentals", icon: IconEducation },
];

const toolCloud = [
  { name: "ChatGPT", accent: "from-emerald-500 to-teal-500" },
  { name: "Claude", accent: "from-orange-400 to-amber-500" },
  { name: "Perplexity", accent: "from-sky-500 to-cyan-500" },
  { name: "Gemini", accent: "from-violet-500 to-fuchsia-500" },
  { name: "Notion AI", accent: "from-slate-700 to-slate-900" },
  { name: "Gamma", accent: "from-blue-500 to-indigo-500" },
  { name: "Canva", accent: "from-cyan-500 to-blue-500" },
  { name: "NotebookLM", accent: "from-lime-500 to-emerald-500" },
];

export default function Home() {
  return (
    <main className="relative grid min-h-screen grid-rows-[auto_1fr_auto] overflow-hidden">
      <LiquidBackground performanceMode="minimal" />

      <div className="row-start-1">
        <Header />
      </div>

      <section className="row-start-2 px-6 py-4 md:py-6">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
          <section className="grid items-start gap-5 lg:grid-cols-[0.82fr_1.18fr]">
            <div className="rounded-[2rem] border border-slate-200/80 bg-white/94 p-6 text-center shadow-[0_18px_40px_rgba(15,23,42,0.06)] md:p-8 lg:text-left">
              <p className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-slate-600">
                IA NEXUS para estudiantes
              </p>

              <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-slate-950 md:text-5xl">
                Descubre herramientas de IA para estudiar mejor
              </h1>

              <p className="mx-auto mt-4 max-w-xl text-base text-slate-600 md:text-lg lg:mx-0">
                Explora opciones para resumir, investigar, presentar y aprender segun lo que
                necesitas hoy.
              </p>

              <div className="mt-5 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700">
                  Gratis y freemium
                </span>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700">
                  Por area
                </span>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700">
                  Mas alla de ChatGPT
                </span>
              </div>

              <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <TrackedWhatsAppLink
                  location="hero"
                  className="inline-flex items-center gap-3 rounded-full px-8 py-4 text-base font-semibold text-white transition-colors duration-150"
                  style={{
                    background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                    boxShadow: "0 12px 24px rgba(59,130,246,0.28)",
                    touchAction: "manipulation",
                  }}
                >
                  Entrar al grupo de WhatsApp
                  <svg width="18" height="18" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path
                      d="M2 7h10M7 2l5 5-5 5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </TrackedWhatsAppLink>

                <Link
                  href="/estudiantes"
                  className="inline-flex items-center rounded-full border border-slate-200 bg-white px-6 py-4 text-base font-medium text-slate-700 transition-colors hover:bg-slate-50"
                >
                  Ver herramientas para estudiantes
                </Link>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-[2rem] border border-slate-200/80 bg-white/94 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
                      Elige tu forma de descubrir herramientas
                    </p>
                    <h2 className="mt-1 text-xl font-semibold text-slate-900 md:text-2xl">
                      Tres caminos claros para empezar
                    </h2>
                  </div>
                  <Link
                    href="/areas"
                    className="hidden rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 md:inline-flex"
                  >
                    Explorar areas
                  </Link>
                </div>

                <div className="mt-5">
                  <PillarCards variant="grid" />
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-200/80 bg-white/94 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Algunas herramientas conocidas
                </p>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {toolCloud.map((tool) => (
                    <div
                      key={tool.name}
                      className="rounded-2xl border border-slate-200 bg-white p-3 text-center shadow-[0_8px_18px_rgba(15,23,42,0.05)]"
                    >
                      <div
                        className={`mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${tool.accent} text-sm font-semibold text-white`}
                      >
                        {tool.name.slice(0, 2).toUpperCase()}
                      </div>
                      <p className="mt-2 text-sm font-medium text-slate-700">{tool.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-[2rem] border border-slate-200/80 bg-white/94 p-6 shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
                Para que te sirve
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
                {useCases.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-slate-700"
                    >
                      <Icon className="h-5 w-5 text-blue-600" />
                      <p className="mt-3 text-sm font-medium">{item.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200/80 bg-white/94 p-6 shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Explora segun tu area
                </p>
                <Link href="/areas" className="text-sm font-medium text-blue-700 hover:text-blue-800">
                  Ver todas
                </Link>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
                {areas.map((area) => {
                  const Icon = area.icon;
                  return (
                    <Link
                      key={area.label}
                      href={area.href}
                      className="rounded-2xl border border-slate-200 bg-white p-4 transition-colors hover:bg-slate-50"
                    >
                      <Icon className="h-5 w-5 text-violet-600" />
                      <p className="mt-3 text-sm font-medium text-slate-700">{area.label}</p>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-slate-200/80 bg-white/94 p-6 shadow-[0_18px_40px_rgba(15,23,42,0.06)] md:p-8">
            <div className="grid items-center gap-5 lg:grid-cols-[1fr_auto]">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Descubre sin perder tiempo
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900 md:text-3xl">
                  Encuentra IAs utiles para estudiar, investigar y aprender mas rapido
                </h2>
                <p className="mt-3 max-w-2xl text-sm text-slate-600 md:text-base">
                  Explora herramientas conocidas, compara opciones y entra a la comunidad para
                  detectar antes cuales realmente valen la pena.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <TrackedWhatsAppLink
                  location="hero"
                  className="inline-flex items-center justify-center rounded-full px-7 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{
                    background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                    boxShadow: "0 12px 24px rgba(59,130,246,0.22)",
                  }}
                >
                  Unirme al WhatsApp
                </TrackedWhatsAppLink>
                <Link
                  href="/areas"
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-7 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                >
                  Explorar por area
                </Link>
              </div>
            </div>
          </section>
        </div>
      </section>

      <div className="row-start-3">
        <Footer />
      </div>
    </main>
  );
}
