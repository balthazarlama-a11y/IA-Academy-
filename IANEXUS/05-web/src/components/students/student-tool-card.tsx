import Link from "next/link";
import type { Tool } from "@/lib/repositories/tools-repo";

function shortDescription(value: string | null) {
  if (!value) return "Herramienta recomendada para potenciar tu trabajo academico.";
  if (value.length <= 140) return value;
  return `${value.slice(0, 137)}...`;
}

function planLabel(plan: Tool["plan"]) {
  if (plan === "edu_free") return "Edu Free";
  if (plan === "free") return "Gratis";
  if (plan === "freemium") return "Freemium";
  return "Pago";
}

function planTone(plan: Tool["plan"]) {
  if (plan === "edu_free") return "border-emerald-300/40 bg-emerald-400/15 text-emerald-100";
  if (plan === "free") return "border-cyan-300/40 bg-cyan-400/15 text-cyan-100";
  if (plan === "freemium") return "border-violet-300/40 bg-violet-400/15 text-violet-100";
  return "border-white/25 bg-white/10 text-white/75";
}

export default function StudentToolCard({ tool }: { tool: Tool }) {
  return (
    <article
      className="relative overflow-hidden rounded-3xl border border-white/15 p-6 shadow-[0_8px_24px_rgba(0,0,0,0.25)]"
      style={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.06) 100%)",
        contain: "layout style paint",
      }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-300/80 via-violet-300/70 to-emerald-300/80" />

      <div className="flex min-h-[260px] flex-col">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium ${planTone(tool.plan)}`}
          >
            {planLabel(tool.plan)}
          </span>
          {tool.edu_verified ? (
            <span className="inline-flex items-center rounded-full border border-emerald-300/30 bg-emerald-400/10 px-3 py-1.5 text-xs font-medium text-emerald-100">
              Pack estudiante
            </span>
          ) : null}
          {tool.ia_type ? (
            <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs text-white/70">
              {tool.ia_type}
            </span>
          ) : null}
        </div>

        <h2 className="mt-5 text-xl font-semibold leading-snug text-white">{tool.name}</h2>
        <p className="mt-3 text-sm leading-relaxed text-white/65">
          {shortDescription(tool.description)}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-3 pt-7">
          <Link
            href={`/herramientas/${tool.slug}`}
            className="inline-flex items-center rounded-full border border-cyan-300/40 bg-cyan-400/15 px-4 py-2.5 text-sm font-medium text-cyan-100 transition-colors duration-150 hover:bg-cyan-400/25"
          >
            Ver detalle
          </Link>
          {tool.url ? (
            <a
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-medium text-white/80 transition-colors duration-150 hover:bg-white/15"
            >
              Ir a herramienta
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
