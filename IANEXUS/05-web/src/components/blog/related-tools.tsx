import Link from "next/link";
import type { RelatedToolForPost } from "@/lib/repositories/post-tools-repo";

function planLabel(plan: RelatedToolForPost["plan"]) {
  switch (plan) {
    case "edu_free":
      return "Beneficio estudiantil";
    case "freemium":
      return "Freemium";
    case "paid":
      return "Pago";
    case "free":
    default:
      return "Gratis";
  }
}

export default function RelatedTools({ tools }: { tools: RelatedToolForPost[] }) {
  return (
    <section className="mt-10 border-t border-slate-200 pt-7">
      <h2 className="text-xl font-semibold text-slate-900">Tools relacionadas</h2>
      <p className="mt-2 text-sm text-slate-600">
        Herramientas conectadas a este post para aplicarlo rápido.
      </p>

      {tools.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
          Aún no hay tools relacionadas para este post.
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          {tools.map((tool) => (
            <Link
              key={tool.id}
              href={`/herramientas/${tool.slug}`}
              className="rounded-2xl border border-slate-200 bg-white p-4 transition-colors hover:bg-slate-50"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-slate-900 font-medium">{tool.name}</p>
                <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-700">
                  {planLabel(tool.plan)}
                </span>
              </div>
              {tool.description ? (
                <p className="text-sm text-slate-600 mt-1 line-clamp-2">{tool.description}</p>
              ) : null}
              <p className="text-xs text-slate-500 mt-3">{tool.category.name}</p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

