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
      className="group rounded-2xl border border-white/12 bg-white/[0.05] p-4 transition hover:border-white/25 hover:bg-white/[0.08]"
    >
      <p className="text-xs uppercase tracking-[0.12em] text-white/45">Blog</p>
      <h3 className="mt-2 text-lg font-semibold text-white group-hover:text-cyan-100">
        {post.title}
      </h3>
      <p className="mt-2 line-clamp-2 text-sm text-white/60">
        {post.excerpt ?? "Contenido nuevo para aplicar en tu flujo diario."}
      </p>
      <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
        <span className="text-xs text-white/45">{formatDate(post.published_at)}</span>
        {post.ia_type ? (
          <span className="rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-xs text-white/70">
            {post.ia_type}
          </span>
        ) : null}
      </div>
    </Link>
  );
}
