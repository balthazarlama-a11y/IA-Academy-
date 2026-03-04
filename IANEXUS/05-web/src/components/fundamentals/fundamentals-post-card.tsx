import Link from "next/link";
import type { FundamentalsPost } from "@/lib/repositories/fundamentals-repo";

function formatDate(value: string | null) {
  if (!value) return "Reciente";
  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default function FundamentalsPostCard({ post }: { post: FundamentalsPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:bg-white"
    >
      <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Blog</p>
      <h3 className="mt-2 text-lg font-semibold text-slate-900 group-hover:text-cyan-700">
        {post.title}
      </h3>
      <p className="mt-2 line-clamp-2 text-sm text-slate-600">
        {post.excerpt ?? "Contenido nuevo para aplicar en tu flujo diario."}
      </p>
      <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3">
        <span className="text-xs text-slate-500">{formatDate(post.published_at)}</span>
        {post.ia_type ? (
          <span className="rounded-full border border-slate-300 bg-slate-50 px-2 py-0.5 text-xs text-slate-700">
            {post.ia_type}
          </span>
        ) : null}
      </div>
    </Link>
  );
}

