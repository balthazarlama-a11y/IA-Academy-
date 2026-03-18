import type { Metadata } from "next";

type BuildPageMetadataArgs = {
  title: string;
  description?: string;
  path?: string;
  image?: string | null;
  type?: "website" | "article";
  noIndex?: boolean;
  keywords?: string[];
};

const DEFAULT_TITLE = "IA NEXUS | Portada editorial de inteligencia artificial";
const DEFAULT_DESCRIPTION =
  "Herramientas, guias y novedades de inteligencia artificial curadas por carrera y necesidad, con foco en utilidad real.";
const DEFAULT_KEYWORDS = [
  "IA",
  "herramientas de inteligencia artificial",
  "guias de IA",
  "IA para estudiantes",
  "IA por carrera",
];

export function getSiteUrl() {
  const explicit =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SITE_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL;

  if (!explicit) {
    return "http://localhost:3000";
  }

  return explicit.startsWith("http") ? explicit : `https://${explicit}`;
}

export function absoluteUrl(path = "/") {
  return new URL(path, getSiteUrl()).toString();
}

export function normalizeDescription(value?: string | null, fallback = DEFAULT_DESCRIPTION) {
  const input = value?.trim();
  if (!input) return fallback;
  if (input.length <= 160) return input;
  return `${input.slice(0, 157).trimEnd()}...`;
}

export function buildRootMetadata(): Metadata {
  return buildPageMetadata({
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    path: "/",
    keywords: DEFAULT_KEYWORDS,
  });
}

export function buildPageMetadata({
  title,
  description,
  path = "/",
  image,
  type = "website",
  noIndex = false,
  keywords = [],
}: BuildPageMetadataArgs): Metadata {
  const resolvedDescription = normalizeDescription(description, DEFAULT_DESCRIPTION);
  const canonical = absoluteUrl(path);
  const images = image ? [{ url: image }] : undefined;

  return {
    title,
    description: resolvedDescription,
    metadataBase: new URL(getSiteUrl()),
    alternates: {
      canonical,
    },
    keywords: [...DEFAULT_KEYWORDS, ...keywords],
    openGraph: {
      title,
      description: resolvedDescription,
      url: canonical,
      type,
      siteName: "IA NEXUS",
      locale: "es_CL",
      images,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description: resolvedDescription,
      images: image ? [image] : undefined,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
        },
  };
}
