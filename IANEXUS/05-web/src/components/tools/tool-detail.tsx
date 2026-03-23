import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BadgeCheck, BookOpenText, Layers3, Sparkles } from "lucide-react";
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

function splitEditorialSummary(summary: string | null, fallbackDescription: string | null) {
  const source = (summary ?? fallbackDescription ?? "").trim();
  if (!source) return [];

  return source
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function shortSentence(value: string, fallback: string) {
  const trimmed = value.trim();
  if (!trimmed) return fallback;
  const sentences = trimmed.split(/(?<=[.!?])\s+/);
  return (sentences[0] ?? trimmed).slice(0, 220);
}

function inferNarrativeSections(tool: Tool) {
  const whatIs = shortSentence(
    tool.editorial_summary?.trim() ||
      tool.description?.trim() ||
      "Herramienta incluida en IA NEXUS para resolver un caso de uso concreto con IA.",
    "Herramienta incluida en IA NEXUS para resolver un caso de uso concreto con IA.",
  );

  const whoIsFor =
    tool.useCases.length > 0
      ? `Encaja especialmente en ${tool.useCases
          .slice(0, 2)
          .map((useCase) => useCase.name.toLowerCase())
          .join(" y ")}.`
      : "Sirve para estudiantes y equipos que buscan un flujo más claro y productivo.";

  const value =
    tool.feature_bullets.length > 0
      ? shortSentence(tool.feature_bullets[0], "Aporta valor cuando necesitas reducir fricción y avanzar más rápido.")
      : "Aporta valor cuando necesitas reducir fricción y avanzar más rápido.";

  return [
    { title: "Qué es", body: whatIs },
    { title: "Para quién sirve", body: whoIsFor },
    { title: "Dónde aporta más valor", body: value },
  ];
}

function QuickStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm font-medium leading-6 text-slate-900">{value}</p>
    </div>
  );
}

export default function ToolDetail({ tool, relatedPosts }: { tool: Tool; relatedPosts: RelatedPostSummary[] }) {
  const primaryContext = tool.primaryArea;
  const accent = primaryContext?.color_accent ?? "#6366f1";
  const demoEmbedUrl = getYouTubeEmbedUrl(tool.demo_video_url);
  const editorialParagraphs = splitEditorialSummary(tool.editorial_summary, tool.description);
  const narrativeSections = inferNarrativeSections(tool);

  return (
    <article className="mx-auto w-full max-w-[1360px] rounded-[2rem] border border-slate-200 bg-white px-4 py-6 shadow-[0_24px_70px_rgba(15,23,42,0.06)] md:px-6 md:py-8 xl:px-8">
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.8fr)_minmax(320px,0.75fr)] xl:gap-10">
        <div className="min-w-0 space-y-8">
          <section className="rounded-[2rem] border border-slate-200 bg-[linear-gradient(180deg,rgba(248,250,252,0.95),rgba(255,255,255,1))] p-5 md:p-7">
            <div className="flex flex-col gap-5 md:flex-row md:items-start">
              {tool.cover_image_url ? (
                <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:h-24 md:w-24">
                  <Image src={tool.cover_image_url} alt={`${tool.name} logo`} width={96} height={96} className="h-full w-full object-contain p-2" />
                </div>
              ) : (
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 md:h-24 md:w-24">
                  <span className="text-3xl font-bold text-slate-300">{tool.name.charAt(0).toUpperCase()}</span>
                </div>
              )}

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  {primaryContext ? (
                    <div
                      className="inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]"
                      style={{ borderColor: `${accent}55`, color: accent, background: `${accent}18` }}
                    >
                      {primaryContext.name}
                    </div>
                  ) : null}
                  <div className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Tool profile
                  </div>
                </div>

                <h1 className="mt-4 text-4xl font-semibold leading-[0.95] tracking-tight text-slate-950 md:text-5xl">
                  {tool.name}
                </h1>
                {tool.tagline ? <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-700">{tool.tagline}</p> : null}
                <div className="mt-5">
                  <ToolMetaBadges tool={tool} />
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold"
                style={{ background: `${accent}22`, border: `1px solid ${accent}44`, color: accent }}
              >
                Visitar herramienta
                <ArrowUpRight className="h-4 w-4" />
              </a>
              {tool.guide_slug ? (
                <Link
                  href={`/blog/${tool.guide_slug}`}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50"
                >
                  Ver guía principal
                  <BookOpenText className="h-4 w-4" />
                </Link>
              ) : null}
            </div>
          </section>

          {(tool.screenshot_url || demoEmbedUrl) ? (
            <section className="grid gap-6 md:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
              {tool.screenshot_url ? (
                <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-50 shadow-[0_16px_44px_rgba(15,23,42,0.08)]">
                  <Image src={tool.screenshot_url} alt={`Vista previa de ${tool.name}`} width={1600} height={900} className="h-full w-full object-cover" />
                </div>
              ) : null}

              {demoEmbedUrl ? (
                <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_16px_44px_rgba(15,23,42,0.08)]">
                  <div className="border-b border-slate-200 px-5 py-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Demo en video</p>
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
                </div>
              ) : null}
            </section>
          ) : null}

          <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 md:p-7">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Overview</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-950">Lectura editorial</h2>
              </div>
              <div className="hidden rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-xs font-medium text-slate-500 md:inline-flex">
                Actualizado {formatDate(tool.created_at)}
              </div>
            </div>

            <div className="mt-5 space-y-4 text-[15px] leading-8 text-slate-700">
              {editorialParagraphs.length > 0 ? (
                editorialParagraphs.map((paragraph, index) => <p key={`${tool.id}-summary-${index}`}>{paragraph}</p>)
              ) : (
                <p>Esta herramienta todavía no tiene una nota editorial larga. Puedes enriquecerla desde admin para convertir esta ficha en una lectura más útil.</p>
              )}
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            {narrativeSections.map((section) => (
              <div key={section.title} className="min-h-[180px] rounded-[1.5rem] border border-slate-200 bg-slate-50/70 p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{section.title}</p>
                <p className="mt-3 text-sm leading-7 text-slate-700">{section.body}</p>
              </div>
            ))}
          </section>

          {tool.feature_bullets.length > 0 ? (
            <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 md:p-7">
              <h2 className="text-2xl font-semibold text-slate-950">Lo más útil de esta herramienta</h2>
              <ul className="mt-5 grid gap-3 md:grid-cols-2">
                {tool.feature_bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-700">
                    <BadgeCheck className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 md:p-7">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-950">Guías relacionadas</h2>
                <p className="mt-2 text-sm text-slate-600">Artículos publicados de IA NEXUS donde aparece esta herramienta.</p>
              </div>
              <div className="hidden text-xs font-medium uppercase tracking-[0.16em] text-slate-400 md:block">
                Archivo editorial
              </div>
            </div>

            {relatedPosts.length > 0 ? (
              <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                {relatedPosts.map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`} className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-5 transition-colors hover:bg-white">
                    <p className="font-medium text-slate-900">{post.title}</p>
                    {post.excerpt ? <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{post.excerpt}</p> : null}
                    <p className="mt-4 text-xs uppercase tracking-[0.16em] text-slate-500">{formatDate(post.publishedAt)}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
                Aún no hay guías enlazadas para esta herramienta.
              </div>
            )}
          </section>
        </div>

        <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50/80 p-5">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Ficha rápida</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <QuickStat label="Empresa" value={tool.company_name ?? "No especificada"} />
              <QuickStat label="Plataformas" value={tool.platform_tags.length > 0 ? tool.platform_tags.join(" · ") : "No especificadas"} />
              <QuickStat label="Idiomas" value={formatLanguages(tool.language_codes)} />
              <QuickStat label="Interfaz en español" value={tool.spanish_available ? "Sí" : "No"} />
            </div>
          </div>

          {tool.areas.length > 0 ? (
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5">
              <div className="flex items-center gap-3">
                <Sparkles className="h-4 w-4 text-slate-500" />
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Áreas</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {tool.areas.map((area) => (
                  <Link
                    key={area.id}
                    href={`/areas?area=${encodeURIComponent(area.slug)}`}
                    className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                  >
                    {area.name}
                  </Link>
                ))}
              </div>
            </div>
          ) : null}

          {tool.useCases.length > 0 ? (
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5">
              <div className="flex items-center gap-3">
                <Layers3 className="h-4 w-4 text-slate-500" />
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Casos de uso</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {tool.useCases.map((useCase) => (
                  <Link
                    key={useCase.id}
                    href={`/areas?useCase=${encodeURIComponent(useCase.slug)}`}
                    className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                  >
                    {useCase.name}
                  </Link>
                ))}
              </div>
            </div>
          ) : null}

          {tool.faq_items.length > 0 ? (
            <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Preguntas frecuentes</p>
              <div className="mt-4 space-y-3">
                {tool.faq_items.map((item) => (
                  <div key={item.question} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                    <p className="text-sm font-semibold text-slate-900">{item.question}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </aside>
      </div>
    </article>
  );
}
