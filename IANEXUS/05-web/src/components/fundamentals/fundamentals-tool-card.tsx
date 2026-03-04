import Link from "next/link";
import type { FundamentalsTool } from "@/lib/repositories/fundamentals-repo";

function planLabel(plan: FundamentalsTool["plan"]) {
  if (plan === "edu_free") return "Edu Free";
  if (plan === "free") return "Gratis";
  if (plan === "freemium") return "Freemium";
  return "Pago";
}

export default function FundamentalsToolCard({ tool }: { tool: FundamentalsTool }) {
  return (
    <Link
      href={`/herramientas/${tool.slug}`}
      className="group rounded-2xl border border-white/12 bg-white/[0.05] p-4 transition hover:border-white/25 hover:bg-white/[0.08]"
    >
      <p className="text-xs uppercase tracking-[0.12em] text-white/45">Tool</p>
      <h3 className="mt-2 text-lg font-semibold text-white group-hover:text-emerald-100">
        {tool.name}
      </h3>
      <p className="mt-2 line-clamp-2 text-sm text-white/60">
        {tool.description ?? "Herramienta recomendada para tu operacion diaria."}
      </p>
      <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
        <span className="rounded-full border border-cyan-300/35 bg-cyan-400/10 px-2 py-0.5 text-xs text-cyan-100">
          {planLabel(tool.plan)}
        </span>
        {tool.edu_verified ? (
          <span className="rounded-full border border-emerald-300/35 bg-emerald-400/10 px-2 py-0.5 text-xs text-emerald-100">
            Pack estudiante
          </span>
        ) : tool.ia_type ? (
          <span className="rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-xs text-white/70">
            {tool.ia_type}
          </span>
        ) : null}
      </div>
    </Link>
  );
}
