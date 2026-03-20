import Link from "next/link";
import { ArrowUpRight, BookOpenText, ExternalLink, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import type { Tool } from "@/lib/types/tool";
import ToolMetaBadges from "@/components/tools/tool-meta-badges";
import { buildToolDetailNarrative } from "@/lib/repositories/tool-detail-copy";

function DetailCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
      <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">{title}</h2>
      <div className="mt-3 text-sm leading-7 text-slate-700">{children}</div>
    </section>
  );
}

function MetaFact({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
      <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-medium text-slate-900">{value}</p>
    </div>
  );
}

export default function ToolDetail({ tool }: { tool: Tool }) {
  const primaryContext = tool.primaryCareer ?? tool.category;
  const accent = primaryContext.color_accent ?? "#6366f1";
  const narrative = buildToolDetailNarrative(tool);

  return (
    <article className="mx-auto w-full max-w-5xl overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
      <div className="grid gap-0 md:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="border-b border-slate-200 bg-slate-50/80 p-6 md:border-b-0 md:border-r md:p-8">
          <div className="flex items-center justify-between gap-3">
            <div
              className="inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold"
              style={{
                borderColor: `${accent}42`,
                color: accent,
                background: `${accent}14`,
              }}
            >
              {primaryContext.name}
            </div>
            {tool.featured ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-300/35 bg-amber-400/10 px-3 py-1 text-[11px] font-semibold text-amber-700">
                <Sparkles className="h-3.5 w-3.5" />
                Destacada
              </span>
            ) : null}
          </div>

          <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_14px_32px_rgba(15,23,42,0.06)]">
            {tool.cover_image_url ? (
              <div className="flex aspect-[4/3] items-center justify-center bg-white p-8">
                <img
                  src={tool.cover_image_url}
                  alt={`${tool.name} preview`}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            ) : (
              <div
                className="flex aspect-[4/3] items-center justify-center"
                style={{
                  background:
                    "radial-gradient(circle at top, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.96) 46%, rgba(241,245,249,1) 100%)",
                }}
              >
                <div className="flex h-24 w-24 items-center justify-center rounded-3xl border border-slate-200 bg-white text-4xl font-bold text-slate-300 shadow-sm">
                  {tool.name.charAt(0).toUpperCase()}
                </div>
              </div>
            )}
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3 md:grid-cols-1">
            {narrative.quickFacts.map((fact) => (
              <MetaFact key={fact.label} label={fact.label} value={fact.value} />
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Lectura rapida</p>
            <p className="mt-2 text-sm leading-6 text-slate-700">{narrative.pricingClarity}</p>
          </div>
        </aside>

        <div className="p-6 md:p-8 lg:p-10">
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Link href="/areas" className="transition-colors hover:text-slate-900">
              Carreras
            </Link>
            <span>/</span>
            <Link
              href={`/areas?category=${encodeURIComponent(primaryContext.slug)}`}
              className="transition-colors hover:text-slate-900"
            >
              {primaryContext.name}
            </Link>
            <span>/</span>
            <span className="text-slate-700">{tool.name}</span>
          </div>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
            {tool.name}
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-700 md:text-lg">
            {narrative.overview}
          </p>

          <div className="mt-5">
            <ToolMetaBadges tool={tool} />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold transition-colors"
              style={{
                background: `${accent}18`,
                border: `1px solid ${accent}32`,
                color: accent,
              }}
            >
              Ir a herramienta
              <ArrowUpRight className="h-4 w-4" />
            </a>

            {tool.guide_slug ? (
              <Link
                href={`/blog/${tool.guide_slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50"
              >
                Leer guia principal
                <BookOpenText className="h-4 w-4" />
              </Link>
            ) : (
              <a
                href="#alternativas"
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50"
              >
                Ver alternativas
                <ArrowUpRight className="h-4 w-4" />
              </a>
            )}

            <a
              href="#media"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              Ver media
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <DetailCard title="Para quien tiene sentido">
              <p>{narrative.whoItIsFor}</p>
            </DetailCard>
            <DetailCard title="Que problema resuelve">
              <p>{narrative.problemItSolves}</p>
            </DetailCard>
            <DetailCard title="Por que puede ser util">
              <p>{narrative.whyItIsUseful}</p>
            </DetailCard>
            <DetailCard title="Precio y acceso">
              <p>{narrative.pricingClarity}</p>
            </DetailCard>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
              <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Guia principal</h2>
              <p className="mt-3 text-sm leading-7 text-slate-700">{narrative.guideLinkNote}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {tool.guide_slug ? (
                  <Link
                    href={`/blog/${tool.guide_slug}`}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-100"
                  >
                    Abrir guia
                    <BookOpenText className="h-4 w-4" />
                  </Link>
                ) : null}
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
                >
                  Abrir herramienta
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </section>

            <section
              id="media"
              className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-[0_10px_24px_rgba(15,23,42,0.04)]"
            >
              <div className="border-b border-slate-200 px-5 py-4">
                <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
                  {narrative.mediaLabel}
                </h2>
              </div>
              {tool.cover_image_url ? (
                <div className="flex items-center justify-center bg-white p-6">
                  <img
                    src={tool.cover_image_url}
                    alt={`${tool.name} media`}
                    className="max-h-48 w-full max-w-full object-contain"
                  />
                </div>
              ) : (
                <div className="p-6">
                  <div className="flex min-h-48 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
                    <p className="max-w-sm text-sm leading-7 text-slate-600">{narrative.mediaCaption}</p>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </article>
  );
}
