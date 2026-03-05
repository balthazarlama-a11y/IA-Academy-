import Link from "next/link";
import { ArrowUpRight, BookOpenText } from "lucide-react";
import type { RelatedPostSummary, Tool } from "@/lib/types/tool";
import ToolMetaBadges from "@/components/tools/tool-meta-badges";

function formatDate(value: string | null) {
  if (!value) return "Reciente";
  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default function ToolDetail({
  tool,
  relatedPosts,
}: {
  tool: Tool;
  relatedPosts: RelatedPostSummary[];
}) {
  const accent = tool.category.color_accent ?? "#6366f1";

  return (
    <article className="mx-auto w-full max-w-4xl rounded-3xl border border-slate-200 bg-white backdrop-blur-xl p-6 md:p-9">
      {/* Logo / Imagen */}
      {tool.cover_image_url ? (
        <div className="mb-6 flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <img
            src={tool.cover_image_url}
            alt={`${tool.name} logo`}
            className="h-full w-full object-contain p-3"
          />
        </div>
      ) : (
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
          <span className="text-3xl font-bold text-slate-300">
            {tool.name.charAt(0).toUpperCase()}
          </span>
        </div>
      )}

      <div
        className="inline-flex rounded-full px-3 py-1 text-xs border"
        style={{
          borderColor: `${accent}55`,
          color: accent,
          background: `${accent}22`,
        }}
      >
        {tool.category.name}
      </div>

      <h1 className="mt-4 text-3xl md:text-4xl font-semibold text-slate-900 leading-tight">
        {tool.name}
      </h1>

      <p className="mt-4 text-slate-700 leading-7">
        {tool.description ??
          "Herramienta de IA catalogada por IA NEXUS para uso academico y profesional."}
      </p>

      <div className="mt-5">
        <ToolMetaBadges tool={tool} />
      </div>

      <div className="mt-7 flex flex-wrap gap-3">
        <a
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-slate-900"
          style={{
            background: `${accent}26`,
            border: `1px solid ${accent}44`,
            color: accent,
          }}
        >
          Ir a herramienta
          <ArrowUpRight className="h-4 w-4" />
        </a>

        {tool.guide_slug ? (
          <Link
            href={`/blog/${tool.guide_slug}`}
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-slate-800 border border-slate-300 bg-slate-50 hover:bg-slate-100 transition-colors"
          >
            Ver guia principal
            <BookOpenText className="h-4 w-4" />
          </Link>
        ) : null}
      </div>

      <section className="mt-9 border-t border-slate-200 pt-7">
        <h2 className="text-xl font-semibold text-slate-900">Guias relacionadas</h2>
        <p className="mt-2 text-sm text-slate-600">
          Articulos publicados de IA NEXUS donde aparece esta herramienta.
        </p>

        {relatedPosts.length > 0 ? (
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            {relatedPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="rounded-2xl border border-slate-200 bg-white p-4 hover:bg-slate-50 transition-colors"
              >
                <p className="text-slate-900 font-medium">{post.title}</p>
                {post.excerpt ? (
                  <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                    {post.excerpt}
                  </p>
                ) : null}
                <p className="text-xs text-slate-500 mt-3">
                  {formatDate(post.publishedAt)}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
            Aún no hay guías enlazadas para esta herramienta.
          </div>
        )}
      </section>
    </article>
  );
}

