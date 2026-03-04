import Link from "next/link";
import { BookOpenText } from "lucide-react";

export default function BlogEmptyState() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center md:px-10">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600">
        <BookOpenText className="h-6 w-6" />
      </div>

      <h2 className="mt-4 text-xl font-medium text-slate-900">Aún no hay posts publicados</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-600">
        Estamos preparando nuevos contenidos para la comunidad. Vuelve pronto para ver
        las proximas guias y recursos.
      </p>

      <div className="mt-6">
        <Link
          href="/"
          className="inline-flex items-center rounded-full border border-cyan-300/30 bg-cyan-400/10 px-5 py-2 text-sm font-medium text-cyan-700 transition hover:bg-cyan-400/15"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}

