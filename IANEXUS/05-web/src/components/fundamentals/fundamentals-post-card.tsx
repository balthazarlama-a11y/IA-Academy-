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
  const kindLabel = post.ia_type ? post.ia_type : "Blog";

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group rounded-[26px] border border-slate-200/80 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.05)] transition duration-200 hover:-translate-y-0.5 hover:border-slate-300"
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Blog</p>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-slate-500">
          {formatDate(post.published_at)}
        </span>
      </div>
      <h3 className="mt-3 text-lg font-semibold tracking-[-0.02em] text-slate-950 transition group-hover:text-slate-700">
        {post.title}
      </h3>
      <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
        {post.excerpt ?? "Contenido nuevo para aplicar en tu flujo diario."}
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-200 pt-3">
        <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-slate-500">
          {kindLabel}
        </span>
        {post.ia_type ? (
          <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-700">
            {post.ia_type}
          </span>
        ) : null}
      </div>
    </Link>
  );
}
