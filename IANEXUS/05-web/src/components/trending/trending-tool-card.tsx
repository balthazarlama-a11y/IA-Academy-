import Link from "next/link";
import { ArrowUpRight, BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TrendingTool } from "@/lib/repositories/trending-surface";
import {
  getTrendingAgeLabel,
  getTrendingLevelLabel,
  getTrendingPlanLabel,
  getTrendingSignalLabel,
} from "@/lib/repositories/trending-surface";

type TrendingToolCardProps = {
  tool: TrendingTool;
  rank: number;
  compact?: boolean;
};

export function TrendingToolCard({ tool, rank, compact = false }: TrendingToolCardProps) {
  const hasGuide = Boolean(tool.guide_slug);
  const signalPills = tool.trendSignals.slice(0, compact ? 2 : 4);

  return (
    <Link
      href={`/herramientas/${tool.slug}`}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_6px_16px_rgba(15,23,42,0.035)] transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_10px_20px_rgba(15,23,42,0.05)]",
        compact ? "p-3 md:p-4" : "p-4 md:p-5",
      )}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-slate-900 via-sky-600 to-emerald-500" />

      <div className={cn("grid gap-4", compact ? "md:grid-cols-[1fr_84px]" : "md:grid-cols-[1fr_132px]")}>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-slate-950 text-[11px] font-semibold tracking-[0.16em] text-white">
              {String(rank).padStart(2, "0")}
            </span>
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-600">
              {tool.trendPrimarySignal}
            </span>
            {tool.featured ? (
              <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-700">
                Destacada
              </span>
            ) : null}
          </div>

          <div className="mt-3 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                {tool.primaryArea?.name ?? "Área general"}
              </p>
              <h3 className={cn("mt-1 font-semibold leading-snug text-slate-950", compact ? "text-[0.98rem]" : "text-[1.1rem] md:text-[1.15rem]")}>
                {tool.name}
              </h3>
            </div>
            <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-slate-700" />
          </div>

          <p className={cn("mt-2 leading-6 text-slate-600", compact ? "text-[0.88rem]" : "text-[0.92rem]")}>
            {tool.description ?? "Seleccion editorial de YourAI para revisar ahora con contexto y sin ruido."}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {signalPills.map((signal) => (
              <span
                key={signal}
                className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600"
              >
                {getTrendingSignalLabel(signal)}
              </span>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-200 pt-3 text-xs text-slate-500">
            <span>{getTrendingAgeLabel(tool.trendAgeDays)}</span>
            <span className="text-slate-300">/</span>
            <span>{getTrendingPlanLabel(tool.plan)}</span>
            <span className="text-slate-300">/</span>
            <span>{getTrendingLevelLabel(tool.level)}</span>
            {hasGuide ? (
              <>
                <span className="text-slate-300">/</span>
                <span className="inline-flex items-center gap-1.5">
                  <BadgeCheck className="h-3.5 w-3.5 text-emerald-600" />
                  Con guia
                </span>
              </>
            ) : null}
          </div>
        </div>

        <div className="order-first md:order-last">
          <div className="overflow-hidden rounded-md border border-slate-200 bg-slate-100">
            <div className={cn("relative w-full", compact ? "aspect-[1/1]" : "aspect-[4/3]")}>
              {tool.cover_image_url ? (
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-[1.02]"
                  style={{ backgroundImage: `url(${tool.cover_image_url})` }}
                />
              ) : (
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.92),rgba(226,232,240,0.72)_45%,rgba(241,245,249,0.92)_100%)]" />
              )}

              <div className="absolute inset-0 bg-gradient-to-br from-slate-950/0 via-slate-950/0 to-slate-950/18" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
