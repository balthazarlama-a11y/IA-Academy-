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
    <article className="mx-auto w-full max-w-4xl rounded-3xl border border-white/15 bg-white/6 backdrop-blur-xl p-6 md:p-9">
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

      <h1 className="mt-4 text-3xl md:text-4xl font-semibold text-white leading-tight">
        {tool.name}
      </h1>

      <p className="mt-4 text-white/70 leading-7">
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
          className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white"
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
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white/85 border border-white/20 bg-white/10 hover:bg-white/15 transition-colors"
          >
            Ver guia principal
            <BookOpenText className="h-4 w-4" />
          </Link>
        ) : null}
      </div>

      <section className="mt-9 border-t border-white/10 pt-7">
        <h2 className="text-xl font-semibold text-white">Guias relacionadas</h2>
        <p className="mt-2 text-sm text-white/55">
          Articulos publicados de IA NEXUS donde aparece esta herramienta.
        </p>

        {relatedPosts.length > 0 ? (
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            {relatedPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="rounded-2xl border border-white/12 bg-white/6 p-4 hover:bg-white/10 transition-colors"
              >
                <p className="text-white font-medium">{post.title}</p>
                {post.excerpt ? (
                  <p className="text-sm text-white/55 mt-1 line-clamp-2">
                    {post.excerpt}
                  </p>
                ) : null}
                <p className="text-xs text-white/40 mt-3">
                  {formatDate(post.publishedAt)}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/55">
            Aun no hay guias enlazadas para esta herramienta.
          </div>
        )}
      </section>
    </article>
  );
}
