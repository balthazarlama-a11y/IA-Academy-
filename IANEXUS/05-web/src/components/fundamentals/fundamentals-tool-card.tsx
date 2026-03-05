import Link from "next/link";
import type { FundamentalsTool } from "@/lib/repositories/fundamentals-repo";
import { StaffEditButton } from "@/components/staff/staff-edit-button";

function planLabel(plan: FundamentalsTool["plan"]) {
  if (plan === "edu_free") return "Edu Free";
  if (plan === "free") return "Gratis";
  if (plan === "freemium") return "Freemium";
  return "Pago";
}

export default function FundamentalsToolCard({ tool }: { tool: FundamentalsTool }) {
  return (
    <article className="group relative rounded-2xl border border-slate-200 bg-white transition hover:border-slate-300 hover:bg-white">
      <StaffEditButton
        href={`/admin/tools?q=${encodeURIComponent(tool.slug)}`}
        label={`Editar herramienta "${tool.name}" en Admin`}
        className="absolute right-3 top-3 z-10"
      />
      <Link href={`/herramientas/${tool.slug}`} className="block p-4">
        <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Tool</p>
        <h3 className="mt-2 text-lg font-semibold text-slate-900 group-hover:text-emerald-700">
          {tool.name}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-slate-600">
          {tool.description ?? "Herramienta recomendada para tu operacion diaria."}
        </p>
        <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3">
          <span className="rounded-full border border-cyan-300/35 bg-cyan-400/10 px-2 py-0.5 text-xs text-cyan-700">
            {planLabel(tool.plan)}
          </span>
          {tool.edu_verified ? (
            <span className="rounded-full border border-emerald-300/35 bg-emerald-400/10 px-2 py-0.5 text-xs text-emerald-700">
              Pack estudiante
            </span>
          ) : tool.ia_type ? (
            <span className="rounded-full border border-slate-300 bg-slate-50 px-2 py-0.5 text-xs text-slate-700">
              {tool.ia_type}
            </span>
          ) : null}
        </div>
      </Link>
    </article>
  );
}

