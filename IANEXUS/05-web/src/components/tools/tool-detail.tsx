import Image from "next/image";
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
  const primaryContext = tool.primaryCareer ?? tool.category;
  const accent = primaryContext.color_accent ?? "#6366f1";

  return (
    <article className="mx-auto w-full max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)] md:p-8">
      {tool.cover_image_url ? (
        <div className="mb-5 flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <Image
            src={tool.cover_image_url}
            alt={`${tool.name} logo`}
            width={80}
            height={80}
            className="h-full w-full object-contain p-2"
          />
        </div>
      ) : (
        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
          <span className="text-3xl font-bold text-slate-300">
            {tool.name.charAt(0).toUpperCase()}
          </span>
        </div>
      )}

      <div
        className="inline-flex rounded-md border px-2.5 py-1 text-[11px] font-medium"
        style={{
          borderColor: `${accent}55`,
          color: accent,
          background: `${accent}22`,
        }}
      >
        {primaryContext.name}
      </div>

      <h1 className="mt-3 text-3xl font-semibold leading-tight text-slate-900 md:text-4xl">
        {tool.name}
      </h1>

      <p className="mt-3 max-w-3xl text-slate-700 leading-7">
        {tool.description ??
          "Herramienta de IA catalogada por IA NEXUS para uso academico y profesional."}
      </p>

      <div className="mt-5">
        <ToolMetaBadges tool={tool} />
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold text-slate-900"
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
            className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-100"
          >
            Ver guia principal
            <BookOpenText className="h-4 w-4" />
          </Link>
        ) : null}
      </div>

      <section className="mt-8 border-t border-slate-200 pt-6">
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
                className="rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:bg-slate-50"
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
          <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
            Aún no hay guías enlazadas para esta herramienta.
          </div>
        )}
      </section>
    </article>
  );
}


