import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BookOpenText, BadgeCheck, Layers3, Sparkles } from "lucide-react";
import type { RelatedPostSummary, Tool } from "@/lib/types/tool";
import ToolMetaBadges from "@/components/tools/tool-meta-badges";

function formatDate(value: string | null) {
  if (!value) return "Reciente";
  return new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));
}

function formatLanguages(codes: string[]) {
  if (codes.length === 0) return "No especificado";
  return codes.map((code) => code.toUpperCase()).join(" · ");
}

function getYouTubeEmbedUrl(url: string | null) {
  if (!url) return null;

  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes("youtu.be")) {
      const videoId = parsed.pathname.replaceAll("/", "").trim();
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }

    if (parsed.hostname.includes("youtube.com")) {
      const videoId = parsed.searchParams.get("v");
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;

      const parts = parsed.pathname.split("/").filter(Boolean);
      if (parts[0] === "embed" && parts[1]) {
        return `https://www.youtube.com/embed/${parts[1]}`;
      }
    }
  } catch {
    return null;
  }

  return null;
}

export default function ToolDetail({ tool, relatedPosts }: { tool: Tool; relatedPosts: RelatedPostSummary[] }) {
  const primaryContext = tool.primaryArea;
  const accent = primaryContext?.color_accent ?? "#6366f1";
  const demoEmbedUrl = getYouTubeEmbedUrl(tool.demo_video_url);

  return (
    <article className="mx-auto w-full max-w-5xl rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)] md:p-8">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)]">
        <div>
          <div className="flex items-start gap-4">
            {tool.cover_image_url ? (
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <Image src={tool.cover_image_url} alt={`${tool.name} logo`} width={80} height={80} className="h-full w-full object-contain p-2" />
              </div>
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
                <span className="text-3xl font-bold text-slate-300">{tool.name.charAt(0).toUpperCase()}</span>
              </div>
            )}
            <div className="min-w-0 flex-1">
              {primaryContext ? <div className="inline-flex rounded-md border px-2.5 py-1 text-[11px] font-medium" style={{ borderColor: `${accent}55`, color: accent, background: `${accent}22` }}>{primaryContext.name}</div> : null}
              <h1 className="mt-3 text-3xl font-semibold leading-tight text-slate-900 md:text-4xl">{tool.name}</h1>
              {tool.tagline ? <p className="mt-3 text-lg text-slate-700">{tool.tagline}</p> : null}
              <p className="mt-3 max-w-3xl text-slate-700 leading-7">{tool.description ?? "Herramienta de IA catalogada por IA NEXUS para uso académico y profesional."}</p>
              <div className="mt-5"><ToolMetaBadges tool={tool} /></div>
            </div>
          </div>

          {tool.screenshot_url ? (
            <div className="mt-6 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-50 shadow-[0_14px_36px_rgba(15,23,42,0.06)]">
              <Image src={tool.screenshot_url} alt={`Vista previa de ${tool.name}`} width={1440} height={810} className="h-auto w-full object-cover" />
            </div>
          ) : null}

          {demoEmbedUrl ? (
            <section className="mt-6 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_14px_36px_rgba(15,23,42,0.06)]">
              <div className="border-b border-slate-200 px-5 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Demo en video
                </p>
              </div>
              <div className="aspect-video w-full">
                <iframe
                  src={demoEmbedUrl}
                  title={`Demo de ${tool.name}`}
                  className="h-full w-full"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            </section>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-3">
            <a href={tool.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold" style={{ background: `${accent}26`, border: `1px solid ${accent}44`, color: accent }}>
              Ir a herramienta
              <ArrowUpRight className="h-4 w-4" />
            </a>
            {tool.guide_slug ? <Link href={`/blog/${tool.guide_slug}`} className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-100">Ver guía principal<BookOpenText className="h-4 w-4" /></Link> : null}
          </div>

          {tool.feature_bullets.length > 0 ? (
            <section className="mt-8 border-t border-slate-200 pt-6">
              <h2 className="text-xl font-semibold text-slate-900">Lo más útil de esta herramienta</h2>
              <ul className="mt-4 grid gap-3 md:grid-cols-2">
                {tool.feature_bullets.map((bullet) => <li key={bullet} className="flex items-start gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"><BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />{bullet}</li>)}
              </ul>
            </section>
          ) : null}

          {tool.faq_items.length > 0 ? (
            <section className="mt-8 border-t border-slate-200 pt-6">
              <h2 className="text-xl font-semibold text-slate-900">Preguntas frecuentes</h2>
              <div className="mt-4 space-y-3">
                {tool.faq_items.map((item) => (
                  <div key={item.question} className="rounded-xl border border-slate-200 bg-white p-4">
                    <p className="text-sm font-semibold text-slate-900">{item.question}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          <section className="mt-8 border-t border-slate-200 pt-6">
            <h2 className="text-xl font-semibold text-slate-900">Guías relacionadas</h2>
            <p className="mt-2 text-sm text-slate-600">Artículos publicados de IA NEXUS donde aparece esta herramienta.</p>
            {relatedPosts.length > 0 ? (
              <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">{relatedPosts.map((post) => <Link key={post.id} href={`/blog/${post.slug}`} className="rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:bg-slate-50"><p className="font-medium text-slate-900">{post.title}</p>{post.excerpt ? <p className="mt-1 line-clamp-2 text-sm text-slate-600">{post.excerpt}</p> : null}<p className="mt-3 text-xs text-slate-500">{formatDate(post.publishedAt)}</p></Link>)}</div>
            ) : <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">Aún no hay guías enlazadas para esta herramienta.</div>}
          </section>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Ficha rápida</p>
            <div className="mt-4 space-y-3 text-sm text-slate-700">
              <div className="flex items-start gap-3"><Sparkles className="mt-0.5 h-4 w-4 text-slate-500" /><div><p className="font-medium text-slate-900">Empresa</p><p>{tool.company_name ?? "No especificada"}</p></div></div>
              <div className="flex items-start gap-3"><Layers3 className="mt-0.5 h-4 w-4 text-slate-500" /><div><p className="font-medium text-slate-900">Plataformas</p><p>{tool.platform_tags.length > 0 ? tool.platform_tags.join(" · ") : "No especificadas"}</p></div></div>
              <div className="flex items-start gap-3"><BadgeCheck className="mt-0.5 h-4 w-4 text-slate-500" /><div><p className="font-medium text-slate-900">Idiomas</p><p>{formatLanguages(tool.language_codes)}</p></div></div>
              <div><p className="font-medium text-slate-900">Interfaz en español</p><p className="mt-1">{tool.spanish_available ? "Sí" : "No"}</p></div>
            </div>
          </div>

          {tool.areas.length > 0 ? <div className="rounded-2xl border border-slate-200 bg-white p-5"><p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Áreas</p><div className="mt-3 flex flex-wrap gap-2">{tool.areas.map((area) => <Link key={area.id} href={`/areas?area=${encodeURIComponent(area.slug)}`} className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100">{area.name}</Link>)}</div></div> : null}
          {tool.useCases.length > 0 ? <div className="rounded-2xl border border-slate-200 bg-white p-5"><p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Casos de uso</p><div className="mt-3 flex flex-wrap gap-2">{tool.useCases.map((useCase) => <Link key={useCase.id} href={`/areas?useCase=${encodeURIComponent(useCase.slug)}`} className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100">{useCase.name}</Link>)}</div></div> : null}
        </aside>
      </div>
    </article>
  );
}
