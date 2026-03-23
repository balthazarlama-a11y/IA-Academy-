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
  const description = tool.tagline ?? tool.description ?? "Herramienta curada por IA NEXUS para uso académico y profesional.";

  return (
    <article className="group overflow-hidden rounded-[1.4rem] border border-slate-200 bg-white shadow-[0_10px_24px_rgba(15,23,42,0.05)] transition hover:border-slate-300 hover:shadow-[0_14px_30px_rgba(15,23,42,0.08)]">
      <div className="h-1 w-full" style={{ background: accent }} />
      <div className="p-4">
        <div className="flex items-start gap-3">
          {tool.cover_image_url ? (
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <Image src={tool.cover_image_url} alt={`${tool.name} logo`} fill unoptimized className="object-contain p-1.5" sizes="56px" />
            </div>
          ) : (
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-slate-200 text-lg font-semibold" style={{ color: accent, background: `${accent}12` }}>
              {tool.name.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium" style={{ color: accent, background: `${accent}12`, border: `1px solid ${accent}28` }}>{areaLabel}</span>
              {useCaseLabel ? <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] text-slate-600">{useCaseLabel}</span> : null}
              {tool.guide_slug ? <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] text-slate-600">Guía disponible</span> : null}
            </div>

            <h3 className="mt-3 text-lg font-semibold leading-snug tracking-tight text-slate-950">{tool.name}</h3>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{description}</p>

            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] text-slate-500">
              <span>{PLAN_LABEL[tool.plan]}</span>
              <span>{levelLabel(tool.level)}</span>
              {tool.ia_type ? <span>{tool.ia_type}</span> : null}
              {tool.verified ? <span className="inline-flex items-center gap-1 text-emerald-700"><BadgeCheck className="h-3.5 w-3.5" />Verificada</span> : null}
              {tool.edu_verified ? <span className="inline-flex items-center gap-1 text-cyan-700"><GraduationCap className="h-3.5 w-3.5" />Académica</span> : null}
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <Link href={`/herramientas/${tool.slug}`} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800">Ver detalle</Link>
          <a href={tool.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100" aria-label={`Abrir ${tool.name}`} title="Abrir sitio">
            <ArrowUpRight className="h-4 w-4" />
            <span className="hidden sm:inline">Abrir</span>
          </a>
        </div>
      </div>
    </article>
  );
}
