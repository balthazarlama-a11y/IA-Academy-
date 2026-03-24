import Image from "next/image";
import { memo } from "react";
import Link from "next/link";
import { BadgeCheck, GraduationCap } from "lucide-react";
import type { Tool } from "@/lib/repositories/tools-repo";
import { StaffEditButton } from "@/components/staff/staff-edit-button";

function shortDescription(value: string | null) {
  if (!value) return "Herramienta recomendada para tu trabajo académico.";
  if (value.length <= 90) return value;
  return `${value.slice(0, 87)}...`;
}

function planLabel(plan: Tool["plan"]) {
  if (plan === "edu_free") return "Beneficio estudiantil";
  if (plan === "free") return "Gratis";
  if (plan === "freemium") return "Freemium";
  return "Pago";
}

function planTone(plan: Tool["plan"]) {
  if (plan === "edu_free") return "border-emerald-300/40 bg-emerald-400/15 text-emerald-700";
  if (plan === "free") return "border-cyan-300/40 bg-cyan-400/15 text-cyan-700";
  if (plan === "freemium") return "border-violet-300/40 bg-violet-400/15 text-violet-700";
  return "border-slate-300 bg-slate-50 text-slate-700";
}

function planSummary(plan: Tool["plan"]) {
  if (plan === "edu_free") return "Requiere correo institucional";
  if (plan === "free") return "Acceso sin pago ni tarjeta";
  if (plan === "freemium") return "Empieza gratis y luego decide";
  return "Requiere pago o upgrade";
}

export default memo(function StudentToolCard({ tool }: { tool: Tool }) {
  return (
    <article
      className="group relative overflow-hidden rounded-[1.4rem] border border-slate-200 bg-white p-5 shadow-[0_8px_22px_rgba(15,23,42,0.06)] transition-all duration-150 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_12px_26px_rgba(15,23,42,0.08)]"
      style={{
        background: "linear-gradient(180deg,#ffffff 0%,#f8fafc 100%)",
        contain: "layout style paint",
      }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-300/80 via-violet-300/70 to-emerald-300/80" />

      <StaffEditButton
        href={`/admin/tools?q=${encodeURIComponent(tool.slug)}`}
        label={`Editar herramienta "${tool.name}" en Admin`}
        className="absolute right-4 top-4 z-10"
      />

      <div className="flex min-h-[204px] flex-col">
        {tool.cover_image_url ? (
          <div className="relative mb-4 flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <Image
              src={tool.cover_image_url}
              alt={`${tool.name} logo`}
              fill
              unoptimized
              className="object-contain p-0.5"
              sizes="56px"
            />
          </div>
        ) : (
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
            <span className="text-2xl font-bold text-slate-300">
              {tool.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${planTone(tool.plan)}`}
          >
            {planLabel(tool.plan)}
          </span>
          {tool.edu_verified && (
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300/30 bg-emerald-400/10 px-2.5 py-1 text-xs font-medium text-emerald-700">
              <GraduationCap className="h-3 w-3" />
              Beneficio estudiantil
            </span>
          )}
          {tool.verified && (
            <span className="inline-flex items-center gap-1 rounded-full border border-blue-300/30 bg-blue-400/10 px-2.5 py-1 text-xs font-medium text-blue-700">
              <BadgeCheck className="h-3 w-3" />
              Verificada
            </span>
          )}
          {tool.ia_type && !tool.edu_verified && (
            <span className="inline-flex items-center rounded-full border border-slate-300 bg-slate-50 px-2.5 py-1 text-xs text-slate-600">
              {tool.ia_type}
            </span>
          )}
        </div>

        <h2 className="mt-4 text-lg font-semibold leading-snug text-slate-900">
          {tool.name}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          {shortDescription(tool.description)}
        </p>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Acceso rápido</p>
          <p className="mt-1 text-sm font-medium text-slate-900">{planSummary(tool.plan)}</p>
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-3 pt-5">
          <Link
            href={`/herramientas/${tool.slug}`}
            className="inline-flex items-center rounded-full border border-cyan-300/40 bg-cyan-400/15 px-4 py-2 text-sm font-medium text-cyan-700 transition-colors duration-150 hover:bg-cyan-400/25"
          >
            Ver detalle
          </Link>
          {tool.url ? (
            <a
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition-colors duration-150 hover:bg-slate-100"
            >
              Ir a herramienta
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
});

