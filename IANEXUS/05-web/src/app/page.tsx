import Link from "next/link";
import { ArrowRight, BookOpen, GraduationCap, Layers3, Sparkles } from "lucide-react";
import Header from "@/components/layout/header";
import EditorialCoverRotator, {
  type EditorialCoverSlide,
} from "@/components/home/editorial-cover-rotator";
import { fetchPublishedPostBySlug, fetchPublishedPosts } from "@/lib/supabase/server";
import { getTrendingSurfaceData } from "@/lib/repositories/trending-repo";
import { postContentBlocksToPlainText } from "@/lib/types/post";

export const revalidate = 300;
export const metadata = {
  title: "IA NEXUS | Portada editorial de inteligencia artificial",
  description:
    "Descubre herramientas, guías y novedades de inteligencia artificial curadas por área y necesidad, con foco en utilidad real para estudiantes y profesionales.",
};

const editorialRoutes = [
  {
    label: "Estudiantes",
    href: "/estudiantes",
    icon: GraduationCap,
    blurb: "Acceso simple a planes gratis y verificación académica.",
    accent: "from-[#e9efff] to-[#f7f9ff] text-[#3351c8] border-[#cfd9ff]",
  },
  {
    label: "Áreas",
    href: "/areas",
    icon: Layers3,
    blurb: "Herramientas ordenadas por contexto profesional.",
    accent: "from-[#eef8f4] to-[#fbfefd] text-[#1f8b63] border-[#cae8db]",
  },
  {
    label: "Día a día",
    href: "/dia-a-dia",
    icon: Sparkles,
    blurb: "Lo útil hoy, sin navegar un catálogo infinito.",
    accent: "from-[#f4edff] to-[#fbf8ff] text-[#7b57d1] border-[#dfd0ff]",
  },
  {
    label: "Blog",
    href: "/blog",
    icon: BookOpen,
    blurb: "Listas, guías y lectura más reposada.",
    accent: "from-[#fff1df] to-[#fffaf2] text-[#c77722] border-[#f3d7b1]",
  },
] as const;

function formatDate(dateString: string | null) {
  if (!dateString) {
    return "Reciente";
  }

  const date = new Date(dateString);

  return new Intl.DateTimeFormat("es-CL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getPostLabel(postKind: string) {
  switch (postKind) {
    case "news":
      return "Actualización";
    case "guide":
      return "Guía";
    case "tool":
      return "Herramienta";
    default:
      return "Portada";
  }
}

function getPlanLabel(plan: string) {
  switch (plan) {
    case "free":
      return "Gratis";
    case "freemium":
      return "Freemium";
    case "paid":
      return "Pago";
    case "edu_free":
      return "Educacional";
    default:
      return plan;
  }
}

function stripMarkdown(content: string) {
  return content
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[>*_~#-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function truncatePreview(text: string, maxLength = 180) {
  if (text.length <= maxLength) return text;
  const candidate = text.slice(0, maxLength);
  const lastSpace = candidate.lastIndexOf(" ");
  return `${candidate.slice(0, lastSpace > 80 ? lastSpace : maxLength).trim()}...`;
}

export default async function Home() {
  const [posts, trendingSurface] = await Promise.all([
    fetchPublishedPosts(),
    getTrendingSurfaceData(6),
  ]);

  const coverPosts = posts.slice(0, 3);
  const coverPostDetails = await Promise.all(
    coverPosts.map(async (post) => {
      const detail = await fetchPublishedPostBySlug(post.slug);
      return [post.id, detail] as const;
    }),
  );
  const coverPostDetailMap = new Map(coverPostDetails);
  const coverSlides: EditorialCoverSlide[] = coverPosts.map((post) => {
    const detail = coverPostDetailMap.get(post.id);
    const structuredPreview =
      detail?.content_json?.length ? postContentBlocksToPlainText(detail.content_json) : "";
    const preview =
      post.subtitle ??
      post.excerpt ??
      (structuredPreview
        ? truncatePreview(structuredPreview)
        : detail?.content_md
          ? truncatePreview(stripMarkdown(detail.content_md))
        : "IA NEXUS reúne herramientas, criterio y contexto para entrar a leer con una idea más clara de por qué esta historia importa.");

    return {
      id: post.id,
      href: `/blog/${post.slug}`,
      title: post.title,
      eyebrow: getPostLabel(post.post_kind),
      preview,
      publishedLabel: formatDate(post.published_at),
      mediaUrl: post.cover_image_url,
    };
  });

  const supportingPosts = posts.slice(1, 3);
  const trendingTools = trendingSurface.rankedTools.slice(0, 3);
  const latestSignals = posts.slice(0, 3);
  const studentHighlight =
    trendingSurface.rankedTools.find(
      (tool) => tool.edu_verified || tool.plan === "edu_free" || tool.plan === "free",
    ) ?? null;

  return (
    <main className="editorial-paper relative min-h-screen overflow-hidden bg-[#f6f2ea] text-[#172033]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.7)_0%,rgba(246,242,234,0.94)_58%,rgba(246,242,234,1)_100%)]" />
      <div className="pointer-events-none absolute left-[8%] top-[10rem] h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(51,81,200,0.16)_0%,rgba(51,81,200,0)_72%)] blur-2xl" />
      <div className="pointer-events-none absolute right-[8%] top-[24rem] h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(133,112,221,0.14)_0%,rgba(133,112,221,0)_72%)] blur-2xl" />
      <div className="pointer-events-none absolute left-[30%] bottom-[12rem] h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(107,194,162,0.13)_0%,rgba(107,194,162,0)_74%)] blur-2xl" />

      <div className="relative z-10">
        <Header />

        <div className="editorial-frame px-5 pb-16 pt-8 md:px-6 lg:px-8 lg:pt-10">
          <section className="grid gap-10 lg:grid-cols-[1.45fr_2.75fr_1.35fr] lg:gap-8">
            <aside className="editorial-rule flex flex-col gap-8 border-b pb-8 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-8">
              <div className="rounded-[1.95rem] border border-[#dbe2f4] bg-[linear-gradient(180deg,rgba(255,255,255,0.84),rgba(233,239,255,0.42))] p-6 shadow-[0_22px_48px_rgba(22,34,51,0.06)]">
                <p className="editorial-kicker editorial-muted">Mapa editorial</p>
                <nav className="mt-6 flex flex-col gap-4">
                  {editorialRoutes.map((route) => {
                    const Icon = route.icon;

                    return (
                      <Link
                        key={route.href}
                        href={route.href}
                        className="group flex items-start gap-3 rounded-[1.35rem] border border-white/70 bg-white/76 px-4 py-4 text-[#172033] shadow-[0_12px_28px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(15,23,42,0.06)]"
                      >
                        <span
                          className={`mt-1 rounded-full border bg-gradient-to-br p-2 shadow-sm transition-colors ${route.accent}`}
                        >
                          <Icon className="h-4 w-4" strokeWidth={1.9} />
                        </span>
                        <span className="min-w-0">
                          <span className="editorial-display nav-link block text-[1.24rem] leading-none">
                            {route.label}
                          </span>
                          <span className="editorial-muted mt-2 block text-[0.92rem] leading-6">
                            {route.blurb}
                          </span>
                        </span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="rounded-[1.8rem] border border-[#cad7ff] bg-[linear-gradient(180deg,rgba(233,239,255,0.95),rgba(242,237,255,0.88))] p-5 shadow-[0_18px_38px_rgba(91,102,184,0.08)]">
                <p className="editorial-kicker text-[#3351c8]">Nota editorial</p>
                <p className="editorial-display mt-3 text-[1rem] leading-7 text-[#243046]">
                  “El objetivo no es listar todo. Es ayudarte a encontrar primero lo que sí vale la pena probar.”
                </p>
              </div>
            </aside>

            <EditorialCoverRotator slides={coverSlides} />

            <aside>
              <div className="rounded-[1.6rem] border-2 border-[#1f2740]/7 bg-[linear-gradient(180deg,rgba(255,255,255,0.86),rgba(233,239,255,0.24)_100%)] p-5 shadow-[0_20px_44px_rgba(15,23,42,0.05)] md:p-5">
                <div className="flex items-center justify-between">
                  <h3 className="editorial-display text-[1.8rem] font-semibold leading-none text-[#111827]">
                    Herramientas en tendencia
                  </h3>
                  <span className="editorial-kicker editorial-muted">Top 3</span>
                </div>

                <div className="editorial-rule mt-5 border-t">
                  {trendingTools.map((tool, index) => (
                    <Link
                      key={tool.id}
                      href={`/herramientas/${tool.slug}`}
                      className="editorial-rule group -mx-2 flex gap-4 border-b px-2 py-4 transition-colors hover:bg-white/55"
                    >
                      <span className="editorial-display text-[1.85rem] font-light text-[#9aa3b6] transition-colors group-hover:text-[#3351c8]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="editorial-display block text-[1.08rem] leading-tight font-semibold text-[#172033] transition-colors group-hover:text-[#3351c8]">
                          {tool.name}
                        </span>
                        <span className="editorial-muted mt-2 block text-[0.96rem] leading-6">
                          {tool.description ?? "Herramienta seleccionada por utilidad, guía vinculada y señal editorial."}
                        </span>
                        <span className="mt-3 block text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-[#6b7280]">
                          {[getPlanLabel(tool.plan), tool.primaryArea?.name ?? "Área general"]
                            .filter(Boolean)
                            .join(" · ")}
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>

                <div className="mt-7 rounded-[1.35rem] border border-[#ddd0ff] bg-[linear-gradient(180deg,rgba(242,237,255,0.92),rgba(255,255,255,0.82))] p-4 shadow-[0_12px_32px_rgba(108,92,231,0.05)]">
                  <p className="editorial-kicker text-[#6b4fd4]">Selección para estudiantes</p>
                  <p className="editorial-display mt-3 text-[1.18rem] leading-tight font-semibold text-[#172033]">
                    {studentHighlight
                      ? `${studentHighlight.name} aparece hoy como señal clara para estudiantes.`
                      : "Revisa beneficios estudiantiles y acceso educacional sin perder tiempo."}
                  </p>
                  <Link
                    href="/estudiantes"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#172033] underline decoration-[#6b4fd4] decoration-2 underline-offset-4 transition-colors hover:text-[#6b4fd4]"
                  >
                    Ver selección estudiantil
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </aside>
          </section>

          <section className="editorial-rule mt-12 grid gap-8 border-t pt-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[1.9rem] border border-[#dfe5f2] bg-[linear-gradient(180deg,rgba(255,255,255,0.8),rgba(238,248,244,0.42))] p-6 shadow-[0_22px_48px_rgba(15,23,42,0.05)] md:p-7">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="editorial-kicker editorial-muted">Últimas lecturas</p>
                  <h3 className="editorial-display mt-2 text-[2rem] font-semibold leading-none text-[#111827]">
                    Sigue desde aquí
                  </h3>
                </div>
                <Link
                  href="/blog"
                  className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[#6b7280] transition-colors hover:text-[#3351c8]"
                >
                  Ir al blog
                </Link>
              </div>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                {supportingPosts.length > 0 ? (
                  supportingPosts.map((post, index) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className={`rounded-[1.5rem] border p-5 shadow-[0_18px_40px_rgba(15,23,42,0.04)] transition-transform hover:-translate-y-0.5 ${
                        index % 2 === 0
                          ? "border-slate-200/80 bg-white/88"
                          : "border-[#dff1e9] bg-[linear-gradient(180deg,rgba(238,248,244,0.92),rgba(255,255,255,0.82))]"
                      }`}
                    >
                      <p className="editorial-kicker text-[#3351c8]">{getPostLabel(post.post_kind)}</p>
                      <h4 className="editorial-display mt-3 text-[1.75rem] leading-tight font-semibold text-[#111827]">
                        {post.title}
                      </h4>
                      <p className="editorial-muted mt-3 text-sm leading-6">
                        {post.subtitle ?? post.excerpt ?? "Lectura breve para profundizar en la conversación editorial."}
                      </p>
                      <p className="mt-4 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#6b7280]">
                        {formatDate(post.published_at)}
                      </p>
                    </Link>
                  ))
                ) : (
                  <div className="rounded-[1.5rem] border border-slate-200/80 bg-white/82 p-4 text-sm text-[#4b5568]">
                    No hay más lecturas activas todavía.
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-[1.9rem] border border-[#dbe2f4] bg-[linear-gradient(180deg,rgba(255,255,255,0.86),rgba(233,239,255,0.32))] p-5 shadow-[0_24px_50px_rgba(15,23,42,0.06)] md:p-6">
              <p className="editorial-kicker editorial-muted">Señales rápidas</p>
              <div className="mt-5 space-y-4">
                {latestSignals.map((post, index) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="flex items-start gap-4 rounded-2xl px-2 py-2 transition-colors hover:bg-white/72"
                  >
                    <span className="editorial-display text-[1.7rem] leading-none text-[#9aa3b6]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#3351c8]">
                        {getPostLabel(post.post_kind)}
                      </span>
                      <span className="editorial-display mt-1 block text-[1.18rem] leading-tight font-semibold text-[#172033]">
                        {post.title}
                      </span>
                      <span className="editorial-muted mt-2 block text-xs leading-5">
                        {formatDate(post.published_at)}
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}


