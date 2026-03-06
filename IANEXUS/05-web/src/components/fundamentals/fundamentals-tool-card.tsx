import Link from "next/link";
import { GraduationCap } from "lucide-react";
import type { FundamentalsTool } from "@/lib/repositories/fundamentals-repo";
import { StaffEditButton } from "@/components/staff/staff-edit-button";

const PLAN_CONFIG: Record<FundamentalsTool["plan"], { label: string; cls: string }> = {
  free:     { label: "Gratis",    cls: "border-emerald-300/40 bg-emerald-400/10 text-emerald-700" },
  edu_free: { label: ".edu Free", cls: "border-sky-300/40 bg-sky-400/10 text-sky-700" },
  freemium: { label: "Freemium",  cls: "border-amber-300/40 bg-amber-400/10 text-amber-700" },
  paid:     { label: "Pago",      cls: "border-slate-300 bg-slate-50 text-slate-500" },
};

export default function FundamentalsToolCard({ tool }: { tool: FundamentalsTool }) {
  const planCfg = PLAN_CONFIG[tool.plan];
  return (
    <article className="group relative rounded-2xl border border-slate-200 bg-white transition hover:border-slate-300 hover:shadow-[0_6px_18px_rgba(15,23,42,0.08)]">
      <StaffEditButton
        href={`/admin/tools?q=${encodeURIComponent(tool.slug)}`}
        label={`Editar herramienta "${tool.name}" en Admin`}
        className="absolute right-3 top-3 z-10"
      />
      <Link href={`/herramientas/${tool.slug}`} className="block p-4">
        <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Tool</p>
        <h3 className="mt-1.5 text-base font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">
          {tool.name}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-slate-500">
          {tool.description ?? "Herramienta recomendada para tu operación diaria."}
        </p>
        <div className="mt-3 flex items-center gap-2 border-t border-slate-100 pt-3">
          <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${planCfg.cls}`}>
            {planCfg.label}
          </span>
          {tool.edu_verified && (
            <span className="inline-flex items-center gap-1 rounded-full border border-sky-300/35 bg-sky-400/10 px-2 py-0.5 text-xs text-sky-700">
              <GraduationCap className="h-3 w-3" />
              Pack .edu
            </span>
          )}
          {tool.ia_type && !tool.edu_verified && (
            <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs text-slate-500">
              {tool.ia_type}
            </span>
          )}
        </div>
      </Link>
    </article>
  );
}

