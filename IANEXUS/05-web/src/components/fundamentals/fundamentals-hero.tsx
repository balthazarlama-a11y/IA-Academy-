import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";

type FundamentalsHeroProps = {
  postsCount: number;
  toolsCount: number;
};

export default function FundamentalsHero({ postsCount, toolsCount }: FundamentalsHeroProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_12px_36px_rgba(15,23,42,0.06)] md:p-6">
      <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-500">
            <Sparkles className="h-3.5 w-3.5 text-cyan-500" />
            Fundamentals
          </p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.03em] text-slate-950 md:text-[3rem]">
            Lo esencial, sin ruido.
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 md:text-base">
            Una selección breve para leer y probar lo más útil del día sin entrar a una vista más cargada.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm text-slate-600 md:min-w-[220px]">
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Lecturas</p>
            <p className="mt-1 text-2xl font-semibold text-slate-950">{postsCount}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Tools</p>
            <p className="mt-1 text-2xl font-semibold text-slate-950">{toolsCount}</p>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3 border-t border-slate-200 pt-4">
        <Link
          href="/dia-a-dia"
          className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          Ir al feed principal
          <ArrowUpRight className="h-4 w-4" />
        </Link>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
        >
          Ver archivo editorial
        </Link>
      </div>
    </section>
  );
}
