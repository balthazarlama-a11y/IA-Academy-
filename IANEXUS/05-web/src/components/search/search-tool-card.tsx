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
  const accent = tool.primaryCareer?.color_accent ?? tool.category.color_accent ?? "#475569";

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.05)] transition hover:border-slate-300 hover:shadow-[0_14px_30px_rgba(15,23,42,0.08)]">
      <div className="flex items-start gap-3">
        {tool.cover_image_url ? (
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white">
            <Image
              src={tool.cover_image_url}
              alt={`${tool.name} logo`}
              fill
              unoptimized
              className="object-contain p-1"
              sizes="48px"
            />
          </div>
        ) : (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-lg font-semibold text-slate-300">
            {tool.name.charAt(0).toUpperCase()}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium"
              style={{
                color: accent,
                background: `${accent}12`,
                border: `1px solid ${accent}28`,
              }}
            >
              {tool.primaryCareer?.name ?? tool.category.name}
            </span>
            <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] text-slate-600">
              {PLAN_LABEL[tool.plan]}
            </span>
            <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] text-slate-600">
              {levelLabel(tool.level)}
            </span>
            {tool.ia_type ? (
              <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] text-slate-500">
                {tool.ia_type}
              </span>
            ) : null}
          </div>

          <h2 className="mt-3 text-lg font-semibold leading-snug text-slate-950">
            {tool.name}
          </h2>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
            {tool.description ?? "Herramienta curada por IA NEXUS para uso académico y profesional."}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
            {tool.verified ? (
              <span className="inline-flex items-center gap-1 text-emerald-600">
                <BadgeCheck className="h-3.5 w-3.5" />
                Verificada
              </span>
            ) : null}
            {tool.edu_verified ? (
              <span className="inline-flex items-center gap-1 text-cyan-600">
                <GraduationCap className="h-3.5 w-3.5" />
                Verificación académica
              </span>
            ) : null}
            {tool.guide_slug ? <span>Tiene guía</span> : null}
          </div>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <Link
          href={`/herramientas/${tool.slug}`}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Ver detalle
        </Link>
        <a
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
        >
          <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>
    </article>
  );
}
