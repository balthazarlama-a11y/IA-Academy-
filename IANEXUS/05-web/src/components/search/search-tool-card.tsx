import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BadgeCheck, GraduationCap } from "lucide-react";
import type { Tool } from "@/lib/types/tool";

const PLAN_LABEL: Record<Tool["plan"], string> = {
  free: "Gratis",
  edu_free: "Beneficio estudiantil",
  freemium: "Freemium",
  paid: "Pago",
};

function levelLabel(level: Tool["level"]) {
  switch (level) {
    case "beginner":
      return "Principiante";
    case "intermediate":
      return "Intermedio";
    case "advanced":
      return "Avanzado";
    default:
      return "Todos los niveles";
  }
}

export default function SearchToolCard({ tool }: { tool: Tool }) {
  const accent = tool.primaryArea?.color_accent ?? "#475569";
  const areaLabel = tool.primaryArea?.name ?? "Área general";
  const useCaseLabel = tool.useCases[0]?.name ?? null;
  const description = tool.tagline ?? tool.description ?? "Herramienta curada por YourAI para uso académico y profesional.";

  return (
    <article className="group overflow-hidden rounded-[0.95rem] border border-slate-300/70 bg-white shadow-[0_8px_18px_rgba(17,24,39,0.05)] transition hover:border-slate-400 hover:shadow-[0_12px_24px_rgba(17,24,39,0.08)] md:rounded-[1.05rem]">
      <div className="h-1 w-full" style={{ background: accent }} />
      <div className="p-3 md:p-4">
        <div className="flex items-start gap-3">
          {tool.cover_image_url ? (
            <div className="relative h-10 w-10 md:h-14 md:w-14 shrink-0 overflow-hidden rounded-[0.8rem] border border-slate-300/70 bg-white md:rounded-[0.9rem]">
              <Image src={tool.cover_image_url} alt={`${tool.name} logo`} fill unoptimized className="object-contain p-1.5" sizes="56px" />
            </div>
          ) : (
            <div className="flex h-10 w-10 md:h-14 md:w-14 shrink-0 items-center justify-center rounded-[0.8rem] md:rounded-2xl border border-slate-200 text-sm md:text-lg font-semibold" style={{ color: accent, background: `${accent}12` }}>
              {tool.name.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex rounded-full px-2 py-1 text-[10px] font-medium md:px-2.5 md:text-[11px]" style={{ color: accent, background: `${accent}12`, border: `1px solid ${accent}28` }}>{areaLabel}</span>
              {useCaseLabel ? <span className="ui-chip inline-flex rounded-full px-2 py-1 text-[10px] md:px-2.5 md:text-[11px]">{useCaseLabel}</span> : null}
              {tool.guide_slug ? <span className="ui-chip inline-flex rounded-full px-2 py-1 text-[10px] md:px-2.5 md:text-[11px]">Guía disponible</span> : null}
            </div>

            <h3 className="mt-2.5 text-[15px] md:text-lg font-semibold leading-snug tracking-tight text-slate-950">{tool.name}</h3>
            <p className="mt-1.5 line-clamp-2 text-[13px] leading-6 text-slate-600 md:mt-2 md:text-sm">{description}</p>

            <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[10px] text-slate-500 md:mt-3 md:gap-y-2 md:text-[11px]">
              <span>{PLAN_LABEL[tool.plan]}</span>
              <span>{levelLabel(tool.level)}</span>
              {tool.ia_type ? <span>{tool.ia_type}</span> : null}
              {tool.verified ? <span className="inline-flex items-center gap-1 text-emerald-700"><BadgeCheck className="h-3.5 w-3.5" />Verificada</span> : null}
              {tool.edu_verified ? <span className="inline-flex items-center gap-1 text-cyan-700"><GraduationCap className="h-3.5 w-3.5" />Académica</span> : null}
            </div>
          </div>
        </div>

        <div className="mt-3 flex gap-2 md:mt-4">
          <Link href={`/herramientas/${tool.slug}`} className="inline-flex flex-1 items-center justify-center gap-2 rounded-[0.85rem] border border-slate-900 bg-slate-950 px-3.5 py-2.5 text-[13px] font-semibold text-white transition hover:bg-slate-800 md:rounded-[0.9rem] md:px-4 md:text-sm">Ver detalle</Link>
          <a href={tool.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-1.5 rounded-[0.85rem] border border-slate-300/70 bg-[#fafaf9] px-3 py-2.5 text-[13px] font-medium text-slate-700 transition hover:bg-slate-100 md:rounded-[0.9rem] md:px-3.5 md:text-sm" aria-label={`Abrir ${tool.name}`} title="Abrir sitio">
            <ArrowUpRight className="h-4 w-4" />
            <span className="hidden sm:inline">Abrir</span>
          </a>
        </div>
      </div>
    </article>
  );
}
