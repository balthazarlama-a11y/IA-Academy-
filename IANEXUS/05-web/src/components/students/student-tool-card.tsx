import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import { BadgeCheck, BookOpen, ExternalLink, GraduationCap } from "lucide-react";
import type { Tool, ToolLevel, ToolPlan } from "@/lib/repositories/tools-repo";
import { StaffEditButton } from "@/components/staff/staff-edit-button";

const PLAN_CONFIG: Record<ToolPlan, { label: string; color: string; bg: string }> = {
  free: { label: "Gratis", color: "rgba(16,185,129,0.92)", bg: "rgba(16,185,129,0.10)" },
  edu_free: {
    label: "Beneficio estudiantil",
    color: "rgba(14,165,233,0.92)",
    bg: "rgba(14,165,233,0.10)",
  },
  freemium: {
    label: "Freemium",
    color: "rgba(234,179,8,0.95)",
    bg: "rgba(234,179,8,0.10)",
  },
  paid: { label: "Pago", color: "rgba(100,116,139,0.92)", bg: "rgba(148,163,184,0.08)" },
};

const LEVEL_LABEL: Record<ToolLevel, string> = {
  beginner: "Principiante",
  intermediate: "Intermedio",
  advanced: "Avanzado",
  all: "Todos los niveles",
};

function shortDescription(value: string | null) {
  if (!value) return "Herramienta útil para estudiar, investigar y avanzar sin ruido.";
  if (value.length <= 120) return value;
  return `${value.slice(0, 117)}...`;
}

function planSummary(tool: Tool) {
  if (tool.plan === "edu_free") return "Se activa con correo institucional o validación académica.";
  if (tool.plan === "free") return "Puedes empezar sin pago ni tarjeta.";
  if (tool.plan === "freemium") return "Tiene entrada gratuita y luego opciones de upgrade.";
  return "Requiere pago o suscripción para desbloquear su uso principal.";
}

function StudentToolCard({ tool }: { tool: Tool }) {
  const plan = PLAN_CONFIG[tool.plan];
  const accentColor = tool.edu_verified ? "#0f766e" : "#16325d";

  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-[0.95rem] border border-slate-300/70 bg-white p-3.5 shadow-[0_8px_18px_rgba(17,24,39,0.05)] transition-all duration-150 hover:-translate-y-0.5 hover:border-slate-400 md:rounded-[1rem] md:p-4"
      style={{ contain: "layout style paint" }}
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,rgba(22,50,93,0.82),rgba(14,165,233,0.82))]" />

      <StaffEditButton
        href={`/admin/tools?q=${encodeURIComponent(tool.slug)}`}
        label={`Editar herramienta "${tool.name}" en Admin`}
        className="absolute right-3 top-3 z-20"
      />

      <div className="relative z-10 flex h-full flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {tool.cover_image_url ? (
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-[0.85rem] border border-slate-300/70 bg-white shadow-sm md:h-12 md:w-12 md:rounded-[0.9rem]">
                <Image
                  src={tool.cover_image_url}
                  alt={`${tool.name} logo`}
                  width={48}
                  height={48}
                  className="h-full w-full object-contain p-0.5"
                />
              </div>
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-[0.85rem] border border-slate-200 bg-slate-50 md:h-12 md:w-12 md:rounded-xl">
                <span className="text-base font-semibold text-slate-300 md:text-lg">
                  {tool.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <span
              className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold md:px-3 md:text-xs"
              style={{ color: plan.color, background: plan.bg }}
            >
              {plan.label}
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="text-[15px] font-semibold leading-snug text-slate-950 transition-colors duration-150 group-hover:text-slate-900 md:text-base">
            {tool.name}
          </h3>
          <p className="line-clamp-2 text-[13px] leading-6 text-slate-600 md:text-sm md:leading-relaxed">
            {shortDescription(tool.description)}
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5 md:gap-2">
          <span
            className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium md:px-3 md:text-xs"
            style={{
              color: accentColor,
              background: `${accentColor}12`,
              border: `1px solid ${accentColor}28`,
            }}
          >
            Estudiantes
          </span>
          <span className="inline-flex items-center rounded-full border border-slate-200 px-2.5 py-1 text-[11px] font-medium text-slate-600 md:px-3 md:text-xs">
            {LEVEL_LABEL[tool.level]}
          </span>
          {tool.ia_type ? (
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] text-slate-500 md:px-3 md:text-xs">
              {tool.ia_type}
            </span>
          ) : null}
        </div>

        <div className="rounded-[0.85rem] border border-slate-300/60 bg-[rgba(250,249,247,0.9)] px-3.5 py-2.5 md:rounded-[0.9rem] md:px-4 md:py-3">
          <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Acceso</p>
          <p className="mt-1 text-[13px] font-medium leading-6 text-slate-950 md:text-sm">
            {planSummary(tool)}
          </p>
        </div>

        <div className="flex items-center gap-2.5 border-t border-slate-200 pt-3 text-[11px] md:gap-3 md:pt-4 md:text-xs">
          {tool.edu_verified ? (
            <span className="inline-flex items-center gap-1.5 text-cyan-700">
              <GraduationCap className="h-4 w-4" />
              Validación académica
            </span>
          ) : null}
          {tool.verified ? (
            <span className="inline-flex items-center gap-1.5 text-emerald-600">
              <BadgeCheck className="h-4 w-4" />
              Verificada
            </span>
          ) : null}
        </div>

        <div className="mt-1 flex gap-2">
          <Link
            href={`/herramientas/${tool.slug}`}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-[0.85rem] px-3.5 py-2.5 text-[13px] font-semibold transition-colors duration-150 md:rounded-[0.9rem] md:px-4 md:text-sm"
            style={{
              background: `${accentColor}16`,
              border: `1px solid ${accentColor}30`,
              color: accentColor,
            }}
          >
            <BookOpen className="h-4 w-4" />
            Ver detalle
          </Link>
          {tool.url ? (
            <a
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 rounded-[0.85rem] px-3 py-2.5 text-[13px] font-semibold text-slate-600 transition-colors duration-150 hover:text-slate-900 md:rounded-[0.9rem] md:px-3.5 md:text-sm"
              style={{
                background: "rgba(250,249,247,0.95)",
                border: "1px solid rgba(148,163,184,0.32)",
              }}
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export default memo(StudentToolCard);
