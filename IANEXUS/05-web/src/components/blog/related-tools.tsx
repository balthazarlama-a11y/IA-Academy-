import Link from "next/link";
import type { RelatedToolForPost } from "@/lib/repositories/post-tools-repo";

function planLabel(plan: RelatedToolForPost["plan"]) {
  switch (plan) {
    case "edu_free":
      return "Edu Free";
    case "freemium":
      return "Freemium";
    case "paid":
      return "Paid";
    case "free":
    default:
      return "Free";
  }
}

export default function RelatedTools({ tools }: { tools: RelatedToolForPost[] }) {
  return (
    <section className="mt-10 border-t border-white/10 pt-7">
      <h2 className="text-xl font-semibold text-white">Tools relacionadas</h2>
      <p className="mt-2 text-sm text-white/55">
        Herramientas conectadas a este post para aplicarlo rapido.
      </p>

      {tools.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/55">
          Aun no hay tools relacionadas para este post.
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          {tools.map((tool) => (
            <Link
              key={tool.id}
              href={`/herramientas/${tool.slug}`}
              className="rounded-2xl border border-white/12 bg-white/6 p-4 transition-colors hover:bg-white/10"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-white font-medium">{tool.name}</p>
                <span className="rounded-full border border-white/15 bg-white/8 px-2 py-0.5 text-xs text-white/70">
                  {planLabel(tool.plan)}
                </span>
              </div>
              {tool.description ? (
                <p className="text-sm text-white/55 mt-1 line-clamp-2">{tool.description}</p>
              ) : null}
              <p className="text-xs text-white/40 mt-3">{tool.category.name}</p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
