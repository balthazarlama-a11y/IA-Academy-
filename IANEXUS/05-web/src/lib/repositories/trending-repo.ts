import { getTools } from "@/lib/repositories/tools-repo";
import { buildTrendingSurface, TRENDING_LIMIT, type TrendingSurface } from "@/lib/repositories/trending-surface";

export async function getTrendingSurfaceData(limit = TRENDING_LIMIT): Promise<TrendingSurface> {
  const tools = await getTools({ limit: 50 });
  return buildTrendingSurface(tools, limit);
}
