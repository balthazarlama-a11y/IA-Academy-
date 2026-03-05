import { TrackedWhatsAppLink } from "@/components/marketing/tracked-whatsapp-link";

interface CommunityCtaBannerProps {
  location: "hero" | "blog_banner" | "areas_banner" | "estudiantes_banner";
  subtitle?: string;
}

export function CommunityCtaBanner({ location, subtitle }: CommunityCtaBannerProps) {
  const defaultSubtitles: Record<string, string> = {
    hero: "Resolvemos preguntas, compartimos prompts y avisamos de nuevas herramientas con plan .edu",
    blog_banner: "Resolvemos preguntas sobre los posts y compartimos prompts exclusivos",
    areas_banner: "Pregunta qué herramienta se adapta mejor a tu área y descubre descuentos exclusivos",
    estudiantes_banner: "Conecta con estudiantes de tu misma carrera y accede a recursos exclusivos",
  };

  const finalSubtitle = subtitle || defaultSubtitles[location] || defaultSubtitles.hero;

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white p-6 md:p-8 text-center">
      <p className="text-lg md:text-xl text-slate-800 font-medium">
        ¿Dudas? Únete a nuestro grupo de estudiantes universitarios
      </p>
      <p className="mt-2 text-sm text-slate-600 max-w-xl mx-auto">
        {finalSubtitle}
      </p>
      <div className="mt-5">
        <TrackedWhatsAppLink
          location={location}
          className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-base font-semibold text-white transition-opacity hover:opacity-90"
          style={{
            background: "linear-gradient(135deg, #2563eb, #7c3aed)",
            boxShadow: "0 8px 20px rgba(59,130,246,0.25)",
          }}
        >
          Unirme al grupo
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
