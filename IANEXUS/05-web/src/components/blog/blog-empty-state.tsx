import Link from "next/link";
import { ArrowUpRight, BookOpenText } from "lucide-react";

type BlogEmptyStateProps = {
  title?: string;
  description?: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export default function BlogEmptyState({
  title = "Aún no hay publicaciones en el archivo",
  description = "Estamos preparando nuevas notas, guías y actualizaciones. Vuelve pronto para ver las primeras piezas publicadas.",
  primaryHref = "/",
  primaryLabel = "Volver al inicio",
  secondaryHref = "/areas",
  secondaryLabel = "Explorar carreras",
}: BlogEmptyStateProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center shadow-[0_18px_50px_rgba(15,23,42,0.05)] md:px-10">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600">
        <BookOpenText className="h-6 w-6" />
      </div>

      <p className="mt-4 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
        Archivo editorial
      </p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
        {title}
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 md:text-base">
        {description}
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link
          href={primaryHref}
          className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          {primaryLabel}
          <ArrowUpRight className="h-4 w-4" />
        </Link>
        <Link
          href={secondaryHref}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950"
        >
          {secondaryLabel}
        </Link>
      </div>
    </div>
  );
}
