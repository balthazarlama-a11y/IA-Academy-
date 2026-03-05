import { TrackedWhatsAppLink } from "@/components/marketing/tracked-whatsapp-link";

interface CommunityCtaBannerProps {
  location: "hero" | "blog_banner" | "areas_banner" | "estudiantes_banner";
  subtitle?: string;
}

export function CommunityCtaBanner({ location, subtitle }: CommunityCtaBannerProps) {
  const defaultSubtitles: Record<string, string> = {
    hero: "Recibe descuentos para estudiantes, herramientas nuevas y casos utiles para proyectos extra.",
    blog_banner: "Entra al grupo para detectar herramientas aplicables, descuentos y oportunidades antes que otros.",
    areas_banner: "Pregunta que herramienta conviene para tu area y enterate de planes .edu y descuentos reales.",
    estudiantes_banner: "Comunidad practica para enterarte antes de descuentos, prompts y herramientas que si suman.",
  };

  const finalSubtitle = subtitle || defaultSubtitles[location] || defaultSubtitles.hero;

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white p-6 text-center md:p-8">
      <p className="text-lg font-medium text-slate-800 md:text-xl">
        Unete al grupo donde se mueve lo ultimo de la IA para estudiantes
      </p>
      <p className="mx-auto mt-2 max-w-xl text-sm text-slate-600">
        {finalSubtitle}
      </p>
      <div className="mt-5">
        <TrackedWhatsAppLink
          location={location}
          className="inline-flex items-center gap-2 rounded-full px-8 py-3 text-base font-semibold text-white transition-opacity hover:opacity-90"
          style={{
            background: "linear-gradient(135deg, #2563eb, #7c3aed)",
            boxShadow: "0 8px 20px rgba(59,130,246,0.25)",
          }}
        >
          Quiero entrar al grupo
          <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
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
  );
}
