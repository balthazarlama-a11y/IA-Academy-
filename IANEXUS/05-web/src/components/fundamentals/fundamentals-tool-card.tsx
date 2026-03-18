import Link from "next/link";
import { GraduationCap } from "lucide-react";
import type { FundamentalsTool } from "@/lib/repositories/fundamentals-repo";
import { StaffEditButton } from "@/components/staff/staff-edit-button";

const PLAN_CONFIG: Record<FundamentalsTool["plan"], { label: string; cls: string }> = {
  free: { label: "Gratis", cls: "border-emerald-300/40 bg-emerald-400/10 text-emerald-700" },
  edu_free: { label: ".edu Free", cls: "border-sky-300/40 bg-sky-400/10 text-sky-700" },
  freemium: { label: "Freemium", cls: "border-amber-300/40 bg-amber-400/10 text-amber-700" },
  paid: { label: "Pago", cls: "border-slate-300 bg-slate-50 text-slate-500" },
};

export default function FundamentalsToolCard({ tool }: { tool: FundamentalsTool }) {
  const planCfg = PLAN_CONFIG[tool.plan];

  return (
    <article className="group relative rounded-xl border border-slate-200/80 bg-white shadow-[0_10px_28px_rgba(15,23,42,0.05)] transition duration-200 hover:-translate-y-0.5 hover:border-slate-300">
      <StaffEditButton
        href={`/admin/tools?q=${encodeURIComponent(tool.slug)}`}
        label={`Editar herramienta "${tool.name}" en Admin`}
        className="absolute right-3 top-3 z-10"
      />
      <Link href={`/herramientas/${tool.slug}`} className="block p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Tool</p>
          <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-medium ${planCfg.cls}`}>
            {planCfg.label}
          </span>
        </div>
        <h3 className="mt-3 text-[1.02rem] font-semibold tracking-[-0.02em] text-slate-950 transition group-hover:text-slate-700">
          {tool.name}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
          {tool.description ?? "Herramienta recomendada para tu operación diaria."}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-200 pt-3">
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
          <span className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-slate-500 transition group-hover:text-slate-700">
            Abrir
            <span aria-hidden="true">↗</span>
          </span>
        </div>
      </Link>
    </article>
  );
}
