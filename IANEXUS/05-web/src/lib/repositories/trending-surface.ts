import type { Tool, ToolLevel, ToolPlan } from "@/lib/types/tool";

export const TRENDING_LIMIT = 12;
export const TRENDING_PRIMARY_LIMIT = 8;
export const TRENDING_SECONDARY_LIMIT = 4;
export const TRENDING_RECENT_WINDOW_DAYS = 45;
const TRENDING_FRESH_WINDOW_DAYS = 14;
const TRENDING_RECENT_BONUS = 28;
const TRENDING_FRESH_BONUS = 42;
const TRENDING_GUIDE_BONUS = 70;
const TRENDING_FEATURED_BONUS = 110;
const TRENDING_VERIFIED_BONUS = 14;
const TRENDING_EDU_BONUS = 10;
const TRENDING_SORT_ORDER_CAP = 12;

export type TrendingSignal = "featured" | "guide" | "recent" | "verified" | "edu";

export type TrendingTool = Tool & {
  trendScore: number;
  trendSignals: TrendingSignal[];
  trendPrimarySignal: string;
  trendAgeDays: number;
};

export type TrendingSurface = {
  rankedTools: TrendingTool[];
  recentTools: TrendingTool[];
  guideTools: TrendingTool[];
  stats: {
    featuredCount: number;
    guideCount: number;
    recentCount: number;
    verifiedCount: number;
  };
  editorialNote: string;
};

function daysBetween(nowMs: number, createdAt: string) {
  const createdAtMs = new Date(createdAt).getTime();
  if (Number.isNaN(createdAtMs)) {
    return Number.POSITIVE_INFINITY;
  }

  return Math.max(0, Math.floor((nowMs - createdAtMs) / 86_400_000));
}

function formatPlanLabel(plan: ToolPlan) {
  switch (plan) {
    case "free":
      return "Gratis";
    case "freemium":
      return "Freemium";
    case "paid":
      return "Pago";
    case "edu_free":
      return "Educativo";
    default:
      return plan;
  }
}

function formatLevelLabel(level: ToolLevel) {
  switch (level) {
    case "beginner":
      return "Basico";
    case "intermediate":
      return "Intermedio";
    case "advanced":
      return "Avanzado";
    case "all":
      return "Todos los niveles";
    default:
      return level;
  }
}

function formatAgeLabel(days: number) {
  if (!Number.isFinite(days)) {
    return "Fecha no disponible";
  }

  if (days === 0) return "Hoy";
  if (days === 1) return "Hace 1 dia";
  if (days < 7) return `Hace ${days} dias`;
  if (days < 30) return "Esta quincena";
  if (days < 60) return "Este mes";
  return "Mas antigua";
}

function getSignalLabel(signal: TrendingSignal) {
  switch (signal) {
    case "featured":
      return "Destacada";
    case "guide":
      return "Con guia";
    case "recent":
      return "Reciente";
    case "verified":
      return "Verificada";
    case "edu":
      return "Para estudiantes";
    default:
      return signal;
  }
}

function getPrimarySignal(signals: TrendingSignal[]) {
  if (signals.includes("featured")) return "Destacada editorial";
  if (signals.includes("guide")) return "Lectura vinculada";
  if (signals.includes("recent")) return "Reciente";
  if (signals.includes("verified")) return "Señal de calidad";
  if (signals.includes("edu")) return "Apta para estudiantes";
  return "Seleccion editorial";
}

function buildSignals(tool: Tool, trendAgeDays: number): TrendingSignal[] {
  const signals: TrendingSignal[] = [];

  if (tool.featured) signals.push("featured");
  if (tool.guide_slug) signals.push("guide");
  if (trendAgeDays <= TRENDING_FRESH_WINDOW_DAYS) signals.push("recent");
  if (tool.verified) signals.push("verified");
  if (tool.edu_verified) signals.push("edu");

  return signals;
}

function scoreTool(tool: Tool, trendAgeDays: number) {
  let score = 0;

  if (tool.featured) score += TRENDING_FEATURED_BONUS;
  if (tool.guide_slug) score += TRENDING_GUIDE_BONUS;
  if (trendAgeDays <= TRENDING_FRESH_WINDOW_DAYS) score += TRENDING_FRESH_BONUS;
  else if (trendAgeDays <= TRENDING_RECENT_WINDOW_DAYS) score += TRENDING_RECENT_BONUS;
  if (tool.verified) score += TRENDING_VERIFIED_BONUS;
  if (tool.edu_verified) score += TRENDING_EDU_BONUS;

  // Lower sort_order still matters, but only as a tiebreaker signal in the editorial blend.
  score += Math.max(0, TRENDING_SORT_ORDER_CAP - Math.min(tool.sort_order, TRENDING_SORT_ORDER_CAP));

  return score;
}

function compareTrendingTools(left: TrendingTool, right: TrendingTool) {
  return (
    right.trendScore - left.trendScore ||
    Number(right.featured) - Number(left.featured) ||
    Number(Boolean(right.guide_slug)) - Number(Boolean(left.guide_slug)) ||
    left.trendAgeDays - right.trendAgeDays ||
    left.sort_order - right.sort_order ||
    left.name.localeCompare(right.name, "es")
  );
}

export function buildTrendingSurface(tools: Tool[], limit = TRENDING_LIMIT): TrendingSurface {
  const nowMs = Date.now();
  const scoredTools = tools.map((tool) => {
    const trendAgeDays = daysBetween(nowMs, tool.created_at);
    const trendSignals = buildSignals(tool, trendAgeDays);

    return {
      ...tool,
      trendAgeDays,
      trendSignals,
      trendPrimarySignal: getPrimarySignal(trendSignals),
      trendScore: scoreTool(tool, trendAgeDays),
    };
  });

  const rankedTools = scoredTools.sort(compareTrendingTools).slice(0, limit);
  const rankedIds = new Set(rankedTools.map((tool) => tool.id));

  const recentTools = scoredTools
    .filter((tool) => !rankedIds.has(tool.id) && tool.trendAgeDays <= TRENDING_RECENT_WINDOW_DAYS)
    .sort(compareTrendingTools)
    .slice(0, TRENDING_SECONDARY_LIMIT);

  const guideTools = scoredTools
    .filter((tool) => !rankedIds.has(tool.id) && Boolean(tool.guide_slug))
    .sort(compareTrendingTools)
    .slice(0, TRENDING_SECONDARY_LIMIT);

  const featuredCount = tools.filter((tool) => tool.featured).length;
  const guideCount = tools.filter((tool) => Boolean(tool.guide_slug)).length;
  const recentCount = tools.filter((tool) => {
    const ageDays = daysBetween(nowMs, tool.created_at);
    return ageDays <= TRENDING_RECENT_WINDOW_DAYS;
  }).length;
  const verifiedCount = tools.filter((tool) => tool.verified || tool.edu_verified).length;

  return {
    rankedTools,
    recentTools,
    guideTools,
    stats: {
      featuredCount,
      guideCount,
      recentCount,
      verifiedCount,
    },
    editorialNote:
      "Orden editorial de primera pasada: primero pesan las herramientas destacadas y las que ya tienen guia vinculada; despues entra la frescura, la verificacion y, por ultimo, el sort_order como desempate. No usamos clicks ni personalizacion todavia.",
  };
}

export function getTrendingSignalLabel(signal: TrendingSignal) {
  return getSignalLabel(signal);
}

export function getTrendingPlanLabel(plan: ToolPlan) {
  return formatPlanLabel(plan);
}

export function getTrendingLevelLabel(level: ToolLevel) {
  return formatLevelLabel(level);
}

export function getTrendingAgeLabel(days: number) {
  return formatAgeLabel(days);
}
