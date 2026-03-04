import Link from "next/link";
import type { RelatedPostSummary } from "@/lib/types/tool";

function formatDate(value: string | null) {
  if (!value) return "Reciente";
  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default function RelatedPosts({ posts }: { posts: RelatedPostSummary[] }) {
  return (
    <section className="mx-auto mt-8 w-full max-w-4xl rounded-3xl border border-slate-200 bg-white p-6 md:p-8">
      <h2 className="text-xl font-semibold text-slate-900">Posts relacionados</h2>
      <p className="mt-2 text-sm text-slate-600">
        Lecturas donde se usa esta herramienta en casos reales.
      </p>

      {posts.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
          Aún no hay posts enlazados para esta herramienta.
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="rounded-2xl border border-slate-200 bg-white p-4 transition-colors hover:bg-slate-50"
            >
              <p className="text-slate-900 font-medium">{post.title}</p>
              {post.excerpt ? (
                <p className="mt-1 line-clamp-2 text-sm text-slate-600">{post.excerpt}</p>
              ) : null}
              <p className="mt-3 text-xs text-slate-500">{formatDate(post.publishedAt)}</p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

