import { TrackedWhatsAppLink } from "@/components/marketing/tracked-whatsapp-link";

interface CommunityCtaBannerProps {
  location: "hero" | "blog_banner" | "areas_banner" | "estudiantes_banner";
  subtitle?: string;
}

export function CommunityCtaBanner({ location, subtitle }: CommunityCtaBannerProps) {
  const titles: Record<string, string> = {
    hero: "Accede a descuentos .edu y herramientas antes que nadie",
    blog_banner: "Detecta herramientas aplicables antes que otros",
    areas_banner: "Pregunta qué herramienta conviene para tu área",
    estudiantes_banner: "No pagues de más por herramientas de IA",
  };

  const defaultSubtitles: Record<string, string> = {
    hero: "Recibe descuentos exclusivos para estudiantes, acceso a herramientas nuevas y casos reales para tus proyectos extra.",
    blog_banner: "Entra al grupo para descubrir descuentos activos, prompts probados y oportunidades antes que tus compañeros.",
    areas_banner: "Pregunta qué herramienta conviene para tu área y entérate de planes .edu con descuentos reales que no anuncian públicamente.",
    estudiantes_banner: "Únete a +200 estudiantes que ya ahorran con descuentos .edu, herramientas gratis para proyectos y oportunidades antes que el resto.",
  };

  const ctaLabels: Record<string, string> = {
    hero: "Quiero acceder a los descuentos",
    blog_banner: "Quiero detectar oportunidades",
    areas_banner: "Preguntar por mi área",
    estudiantes_banner: "Unirme y empezar a ahorrar",
  };

  const finalTitle = titles[location] || titles.hero;
  const finalSubtitle = subtitle || defaultSubtitles[location] || defaultSubtitles.hero;
  const finalCta = ctaLabels[location] || ctaLabels.hero;

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 text-center md:p-8">
      <p className="text-lg font-semibold text-slate-800 md:text-xl">
        {finalTitle}
      </p>
      <p className="mx-auto mt-2 max-w-xl text-sm text-slate-600">
        {finalSubtitle}
      </p>
      <div className="mt-5">
        <TrackedWhatsAppLink
          location={location}
          className="inline-flex items-center gap-2 rounded-full px-8 py-3 text-base font-semibold text-white transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: "linear-gradient(135deg, #22c55e, #16a34a)",
            boxShadow: "0 8px 20px rgba(34,197,94,0.3)",
          }}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
            <path d="M20.52 3.48A11.83 11.83 0 0 0 12.05 0C5.57 0 .29 5.28.29 11.76c0 2.07.54 4.08 1.57 5.86L0 24l6.56-1.81a11.72 11.72 0 0 0 5.49 1.4h.01c6.48 0 11.76-5.28 11.76-11.76 0-3.14-1.22-6.1-3.3-8.35Zm-8.47 18.12h-.01a9.8 9.8 0 0 1-4.99-1.37l-.36-.21-3.89 1.08 1.04-3.79-.23-.39a9.76 9.76 0 0 1-1.5-5.16c0-5.41 4.41-9.82 9.84-9.82 2.62 0 5.09 1.02 6.95 2.89a9.75 9.75 0 0 1 2.88 6.94c0 5.42-4.41 9.83-9.83 9.83Z" />
          </svg>
          {finalCta}
        </TrackedWhatsAppLink>
      </div>
      <p className="mt-3 text-xs text-slate-400">
        Sin spam. Solo alertas de descuentos y herramientas útiles.
      </p>
    </div>
  );
}
