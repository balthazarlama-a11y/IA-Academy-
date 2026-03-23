import { BadgeCheck, GraduationCap, Layers3, Sparkles } from "lucide-react";
import type { Tool } from "@/lib/types/tool";

const PLAN_BADGE: Record<Tool["plan"], { label: string; color: string; bg: string; border: string }> = {
  free: { label: "Gratis", color: "#059669", bg: "rgba(16,185,129,0.10)", border: "rgba(52,211,153,0.35)" },
  edu_free: { label: "Beneficio estudiantil", color: "#0284c7", bg: "rgba(56,189,248,0.10)", border: "rgba(56,189,248,0.35)" },
  freemium: { label: "Freemium", color: "#d97706", bg: "rgba(251,191,36,0.12)", border: "rgba(251,191,36,0.40)" },
  paid: { label: "Pago", color: "#64748b", bg: "rgba(148,163,184,0.08)", border: "rgba(148,163,184,0.30)" },
};

const LEVEL_LABEL: Record<Tool["level"], string> = {
  beginner: "Principiante",
  intermediate: "Intermedio",
  advanced: "Avanzado",
  all: "Todos los niveles",
};

export default function ToolMetaBadges({ tool }: { tool: Tool }) {
  const planBadge = PLAN_BADGE[tool.plan];
  const statusLabel = tool.edu_verified
    ? { icon: GraduationCap, className: "border-cyan-300/30 bg-cyan-400/10 text-cyan-700", text: "Verificación académica" }
    : tool.verified
      ? { icon: BadgeCheck, className: "border-emerald-300/30 bg-emerald-400/10 text-emerald-700", text: "Verificada" }
      : null;
  const StatusIcon = statusLabel?.icon;

  return (
    <div className="flex flex-wrap gap-2">
      <span className="inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-semibold" style={{ color: planBadge.color, background: planBadge.bg, borderColor: planBadge.border }}><Sparkles className="h-3.5 w-3.5" />{planBadge.label}</span>
      <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700"><Layers3 className="h-3.5 w-3.5" />{LEVEL_LABEL[tool.level]}</span>
      {tool.spanish_available ? <span className="inline-flex items-center gap-1 rounded-md border border-violet-200 bg-violet-50 px-2.5 py-1 text-xs text-violet-700"><Sparkles className="h-3.5 w-3.5" />Interfaz en español</span> : null}
      {statusLabel ? <span className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs ${statusLabel.className}`}>{StatusIcon ? <StatusIcon className="h-3.5 w-3.5" /> : null}{statusLabel.text}</span> : null}
    </div>
  );
}
