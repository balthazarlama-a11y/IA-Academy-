import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Tool } from "@/lib/types/tool";
import ToolMetaBadges from "@/components/tools/tool-meta-badges";

function shortDescription(value: string | null) {
  if (!value) {
    return "Alternativa curada para ampliar contexto antes de salir del sitio.";
  }

  if (value.length <= 120) {
    return value;
  }

  return `${value.slice(0, 117).trimEnd()}...`;
}

export default function RelatedTools({ tools }: { tools: Tool[] }) {
  return (
    <section
      id="alternativas"
      className="mx-auto mt-8 w-full max-w-5xl rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)] md:p-8"
    >
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Alternativas cercanas</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Otras tools de la misma carrera para comparar enfoque, acceso y nivel antes de salir.
          </p>
        </div>
        <p className="text-sm text-slate-500">Misma necesidad, distinto encaje.</p>
      </div>

      {tools.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
          Todavia no hay alternativas enlazadas para esta herramienta.
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {tools.map((tool) => (
            <article
              key={tool.id}
              className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)] transition-all duration-150 hover:-translate-y-0.5 hover:border-slate-300"
            >
              <div className="flex items-start gap-4">
                {tool.cover_image_url ? (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white">
                    <img
                      src={tool.cover_image_url}
                      alt={`${tool.name} logo`}
                      className="h-full w-full object-contain p-1"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
                    <span className="text-lg font-semibold text-slate-300">
                      {tool.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="truncate text-base font-semibold text-slate-950">{tool.name}</h3>
                    {tool.featured ? (
                      <span className="shrink-0 rounded-full border border-amber-300/40 bg-amber-400/10 px-2.5 py-1 text-[11px] font-medium text-amber-700">
                        Destacada
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{shortDescription(tool.description)}</p>
                </div>
              </div>

              <div className="mt-4">
                <ToolMetaBadges tool={tool} />
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <Link
                  href={`/herramientas/${tool.slug}`}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-100"
                >
                  Ver detalle
                </Link>
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
                >
                  Abrir sitio
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
