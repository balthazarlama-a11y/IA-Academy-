import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";

type FundamentalsHeroProps = {
  postsCount: number;
  toolsCount: number;
};

export default function FundamentalsHero({ postsCount, toolsCount }: FundamentalsHeroProps) {
  return (
    <section className="overflow-hidden rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)] md:p-6">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-500">
            <Sparkles className="h-3.5 w-3.5 text-cyan-500" />
            Fundamentals
          </p>
          <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.03em] text-slate-950 md:text-[3.4rem]">
            Lo esencial, sin ruido.
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600 md:text-base">
            Lecturas y tools curadas para avanzar rápido en el día sin perder contexto editorial.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
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
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          <div className="rounded-[20px] border border-slate-200 bg-slate-950 p-4 text-white shadow-[0_18px_40px_rgba(15,23,42,0.18)]">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Posts</p>
            <p className="mt-3 text-3xl font-semibold">{postsCount}</p>
            <p className="mt-2 text-sm text-slate-300">Lecturas en el feed compactado.</p>
          </div>

          <div className="rounded-[20px] border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Tools</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">{toolsCount}</p>
            <p className="mt-2 text-sm text-slate-600">Herramientas listas para revisar hoy.</p>
          </div>

          <div className="rounded-[20px] border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Rol</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">2</p>
            <p className="mt-2 text-sm text-slate-600">Blog y tools como dos carriles del mismo sistema.</p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-200 pt-5">
        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-500">Lectura rápida</span>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-500">Tools del día</span>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-500">Misma lógica editorial</span>
      </div>
    </section>
  );
}
