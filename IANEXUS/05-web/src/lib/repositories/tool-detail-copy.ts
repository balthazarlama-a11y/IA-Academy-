import type { Tool } from "@/lib/types/tool";

export type ToolDetailNarrative = {
  overview: string;
  whoItIsFor: string;
  problemItSolves: string;
  whyItIsUseful: string;
  pricingClarity: string;
  guideLinkNote: string;
  mediaLabel: string;
  mediaCaption: string;
  quickFacts: Array<{ label: string; value: string }>;
};

const PLAN_LABEL: Record<Tool["plan"], string> = {
  free: "Gratis",
  edu_free: "Beneficio estudiantil",
  freemium: "Freemium",
  paid: "Pago",
};

const LEVEL_LABEL: Record<Tool["level"], string> = {
  beginner: "Principiante",
  intermediate: "Intermedio",
  advanced: "Avanzado",
  all: "Todos los niveles",
};

function cleanText(value: string | null | undefined) {
  return value?.trim() ?? "";
}

function describeLevel(level: Tool["level"]) {
  return LEVEL_LABEL[level];
}

function describePlan(tool: Tool) {
  switch (tool.plan) {
    case "edu_free":
      return "Tiene acceso educativo sin costo para usuarios verificados. Revisa si tu cuenta entra en el programa.";
    case "free":
      return "No exige pago inicial. El criterio real es si sus limites cubren tu flujo de trabajo.";
    case "freemium":
      return "Permite probar antes de pagar. Conviene si el plan libre te alcanza para el caso de uso que tienes hoy.";
    case "paid":
      return "Requiere pago o upgrade. Vale la pena solo si reemplaza trabajo manual o herramientas que ya pagas.";
  }
}

export function buildToolDetailNarrative(tool: Tool): ToolDetailNarrative {
  const careerName = tool.primaryCareer?.name ?? tool.category?.name ?? "esta carrera";
  const careerDescription = cleanText(tool.primaryCareer?.description ?? tool.category?.description);
  const overview =
    cleanText(tool.description) ||
    "Herramienta de IA catalogada por IA NEXUS para evaluar utilidad, acceso y contexto antes de salir al sitio externo.";

  const whoItIsFor = careerDescription
    ? `${careerDescription} La ficha la ubica aquí porque encaja mejor con ${careerName.toLowerCase()} y un nivel ${describeLevel(tool.level).toLowerCase()}.`
    : `Encaja mejor si trabajas en ${careerName.toLowerCase()} y quieres una herramienta de nivel ${describeLevel(tool.level).toLowerCase()}.`;

  const problemItSolves = tool.ia_type
    ? `Reduce fricción en tareas repetitivas vinculadas a ${tool.ia_type.toLowerCase()}.`
    : `Reduce fricción en tareas repetitivas vinculadas a ${careerName.toLowerCase()}.`;

  const usefulnessParts: string[] = [];
  if (tool.edu_verified) {
    usefulnessParts.push("IA NEXUS la marca con señal academica, asi que tiene una ventaja clara para estudiantes.");
  } else if (tool.verified) {
    usefulnessParts.push("La ficha esta verificada, lo que ayuda a separar curacion editorial de simple marketing.");
  }
  if (tool.featured) {
    usefulnessParts.push("Ademas, el catalogo la destaca visualmente, lo que sugiere mayor prioridad editorial.");
  }
  if (usefulnessParts.length === 0) {
    usefulnessParts.push("La mejor razon para seguir leyendo es comparar su ajuste real con las alternativas cercanas.");
  }

  const pricingClarity = describePlan(tool);

  const guideLinkNote = tool.guide_slug
    ? "Hay una guia principal enlazada para bajar la curva de aprendizaje antes de salir del sitio."
    : "Todavia no hay una guia principal enlazada; la mejor ruta es comparar alternativas y revisar posts relacionados.";

  const mediaLabel = tool.cover_image_url ? "Imagen de cobertura" : "Sin imagen publica";
  const mediaCaption = tool.cover_image_url
    ? "IA NEXUS muestra esta imagen como señal visual de la herramienta dentro del catalogo."
    : "Esta herramienta no tiene imagen de cobertura publica registrada en el catalogo.";

  return {
    overview,
    whoItIsFor,
    problemItSolves,
    whyItIsUseful: usefulnessParts.join(" "),
    pricingClarity,
    guideLinkNote,
    mediaLabel,
    mediaCaption,
    quickFacts: [
      { label: "Carrera", value: careerName },
      { label: "Nivel", value: describeLevel(tool.level) },
      { label: "Acceso", value: PLAN_LABEL[tool.plan] },
    ],
  };
}
