import { getTools } from "@/lib/repositories/tools-repo";
import type { Tool } from "@/lib/types/tool";

export async function getRelatedToolsForTool(tool: Tool, limit = 4): Promise<Tool[]> {
  const careerSlug = tool.primaryCareer?.slug ?? tool.category?.slug ?? "";
  const maxResults = Math.max(1, limit);

  const sameCareer = careerSlug ? await getTools({ careerSlugs: [careerSlug], limit: maxResults + 1 }) : [];
  const sameCareerAlternatives = sameCareer.filter((candidate) => candidate.slug !== tool.slug).slice(0, maxResults);
  if (sameCareerAlternatives.length > 0) {
    return sameCareerAlternatives;
  }

  const fallback = await getTools({ limit: maxResults + 1 });
  return fallback.filter((candidate) => candidate.slug !== tool.slug).slice(0, maxResults);
}
