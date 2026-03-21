import type { Tool } from "@/lib/types/tool";

const STOP_WORDS = new Set([
  "a",
  "al",
  "como",
  "con",
  "de",
  "del",
  "el",
  "en",
  "e",
  "es",
  "la",
  "las",
  "lo",
  "los",
  "o",
  "para",
  "por",
  "que",
  "sin",
  "su",
  "sus",
  "un",
  "una",
  "y",
]);

const STUDENT_INTENT_TERMS = new Set([
  "estudiante",
  "estudiantes",
  "edu",
  "educacion",
  "educativo",
  "educativa",
  "beneficio",
  "universidad",
  "universitario",
  "universitarios",
  "beca",
  "gratis",
  "gratuito",
]);

const GUIDE_INTENT_TERMS = new Set([
  "guia",
  "guias",
  "tutorial",
  "tutoriales",
  "uso",
  "usar",
  "aprende",
  "aprender",
  "como",
  "hacer",
]);

const PRICE_INTENT_TERMS = new Set([
  "gratis",
  "gratuito",
  "free",
  "freemium",
  "pago",
  "pagar",
  "precio",
  "costo",
  "coste",
  "plan",
]);

function stripDiacritics(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function normalizeSearchText(value: string | null | undefined) {
  return stripDiacritics((value ?? "").trim().toLowerCase()).replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ").trim();
}

function tokenizeQuery(query: string) {
  const normalized = normalizeSearchText(query);
  if (!normalized) return [];

  const tokens = normalized
    .split(" ")
    .map((token) => token.trim())
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token));

  if (tokens.length > 0) {
    return tokens;
  }

  return [normalized];
}

function planText(tool: Tool) {
  switch (tool.plan) {
    case "free":
      return "gratis free sin pago";
    case "edu_free":
      return "beneficio estudiantil estudiantes gratis educacion edu free";
    case "freemium":
      return "freemium gratis prueba plan mixto";
    case "paid":
      return "pago precio premium suscripcion";
  }
}

function guideText(tool: Tool) {
  if (!tool.guide_slug) {
    return "";
  }

  return `guia tutorial uso aprender ${tool.guide_slug.replaceAll("-", " ")}`;
}

function careerText(tool: Tool) {
  return (tool.careers ?? [tool.primaryCareer ?? tool.category])
    .filter(Boolean)
    .map((career) => `${career.name} ${career.slug}`)
    .join(" ");
}

function buildSearchDocument(tool: Tool) {
  return {
    name: normalizeSearchText(tool.name),
    slug: normalizeSearchText(tool.slug),
    description: normalizeSearchText(tool.description),
    iaType: normalizeSearchText(tool.ia_type),
    careers: normalizeSearchText(careerText(tool)),
    guide: normalizeSearchText(guideText(tool)),
    plan: normalizeSearchText(planText(tool)),
    all: normalizeSearchText(
      [
        tool.name,
        tool.slug,
        tool.description,
        tool.ia_type,
        careerText(tool),
        guideText(tool),
        planText(tool),
      ]
        .filter(Boolean)
        .join(" "),
    ),
  };
}

function scoreField(field: string, phrase: string, exactWeight: number, prefixWeight: number, containsWeight: number) {
  if (!field || !phrase) return 0;
  if (field === phrase) return exactWeight;
  if (field.startsWith(phrase)) return prefixWeight;
  if (field.includes(phrase)) return containsWeight;
  return 0;
}

function scoreToken(field: string, token: string, weight: number) {
  return field.includes(token) ? weight : 0;
}

export function scoreToolRelevance(tool: Tool, query: string) {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) {
    return 0;
  }

  const tokens = tokenizeQuery(query);
  const fields = buildSearchDocument(tool);

  let score = 0;

  score += scoreField(fields.name, normalizedQuery, 240, 180, 120);
  score += scoreField(fields.slug, normalizedQuery, 160, 120, 80);
  score += scoreField(fields.careers, normalizedQuery, 150, 110, 75);
  score += scoreField(fields.iaType, normalizedQuery, 130, 95, 60);
  score += scoreField(fields.guide, normalizedQuery, 110, 80, 50);
  score += scoreField(fields.plan, normalizedQuery, 90, 70, 45);
  score += scoreField(fields.description, normalizedQuery, 70, 45, 25);

  for (const token of tokens) {
    score += scoreToken(fields.name, token, 24);
    score += scoreToken(fields.slug, token, 18);
    score += scoreToken(fields.careers, token, 16);
    score += scoreToken(fields.iaType, token, 14);
    score += scoreToken(fields.guide, token, 12);
    score += scoreToken(fields.plan, token, 12);
    score += scoreToken(fields.description, token, 6);
  }

  if (tokens.some((token) => STUDENT_INTENT_TERMS.has(token))) {
    if (tool.edu_verified) {
      score += 22;
    }
    if (tool.plan === "edu_free") {
      score += 18;
    }
    score += scoreToken(fields.plan, "beneficio estudiantil", 10);
  }

  if (tokens.some((token) => GUIDE_INTENT_TERMS.has(token))) {
    if (tool.guide_slug) {
      score += 14;
    }
    score += scoreToken(fields.guide, "guia", 6);
  }

  if (tokens.some((token) => PRICE_INTENT_TERMS.has(token))) {
    score += scoreToken(fields.plan, "gratis", 8);
    score += scoreToken(fields.plan, "pago", 6);
  }

  if (tool.featured) {
    score += 2;
  }

  return score;
}

export function compareToolsByEditorialPriority(a: Tool, b: Tool) {
  if (a.featured !== b.featured) return a.featured ? -1 : 1;
  if (a.edu_verified !== b.edu_verified) return a.edu_verified ? -1 : 1;
  if (a.verified !== b.verified) return a.verified ? -1 : 1;
  if (a.sort_order !== b.sort_order) return a.sort_order - b.sort_order;
  return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
}

export function compareSearchTools(a: Tool, b: Tool, query: string) {
  const scoreA = scoreToolRelevance(a, query);
  const scoreB = scoreToolRelevance(b, query);

  if (scoreA !== scoreB) {
    return scoreB - scoreA;
  }

  return compareToolsByEditorialPriority(a, b);
}
