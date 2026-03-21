import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, GraduationCap, Layers3, Sparkles } from "lucide-react";
import EditorialTopbar from "@/components/home/editorial-topbar";
import { fetchPublishedPosts } from "@/lib/supabase/server";
import { getTrendingSurfaceData } from "@/lib/repositories/trending-repo";

export const revalidate = 300;
export const metadata = {
  title: "IA NEXUS | Portada editorial de inteligencia artificial",
  description:
    "Descubre herramientas, guías y novedades de inteligencia artificial curadas por carrera y necesidad, con foco en utilidad real para estudiantes y profesionales.",
};

const editorialRoutes = [
  {
    label: "Estudiantes",
    href: "/estudiantes",
    icon: GraduationCap,
    blurb: "Acceso simple a planes gratis y verificación académica.",
  },
  {
    label: "Carreras",
    href: "/areas",
    icon: Layers3,
    blurb: "Herramientas ordenadas por contexto profesional.",
  },
  {
    label: "Día a día",
    href: "/dia-a-dia",
    icon: Sparkles,
    blurb: "Lo útil hoy, sin navegar un catálogo infinito.",
  },
  {
    label: "Blog",
    href: "/blog",
    icon: BookOpen,
    blurb: "Listas, guías y lectura más reposada.",
  },
];

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

export default async function Home() {
  const [posts, trendingSurface] = await Promise.all([
    fetchPublishedPosts(),
    getTrendingSurfaceData(6),
  ]);

  const featuredPost = posts[0] ?? null;
  const supportingPosts = posts.slice(1, 3);
  const trendingTools = trendingSurface.rankedTools.slice(0, 3);
  const latestSignals = posts.slice(0, 3);
  const studentHighlight =
    trendingSurface.rankedTools.find(
      (tool) => tool.edu_verified || tool.plan === "edu_free" || tool.plan === "free",
    ) ?? null;

  return (
    <main className="editorial-paper relative min-h-screen overflow-hidden bg-[#f6f2ea] text-[#172033]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[24rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.62)_0%,rgba(246,242,234,0.9)_56%,rgba(246,242,234,1)_100%)]" />

      <div className="relative z-10">
        <EditorialTopbar />

        <div className="editorial-frame px-5 pb-14 pt-8 md:px-6 lg:px-8 lg:pt-10">
          <section className="grid gap-12 lg:grid-cols-10 lg:gap-9">
            <aside className="editorial-rule flex flex-col gap-8 border-b pb-8 lg:col-span-2 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-8">
              <div className="rounded-[1.75rem] border border-slate-200/70 bg-white/72 p-5 shadow-[0_20px_44px_rgba(15,23,42,0.05)]">
                <p className="editorial-kicker editorial-muted">Mapa editorial</p>
                <nav className="mt-5 flex flex-col gap-5">
                  {editorialRoutes.map((route) => {
                    const Icon = route.icon;

                    return (
                      <Link
                        key={route.href}
                        href={route.href}
                        className="group flex items-start gap-3 text-[#172033] transition-colors hover:text-[#3351c8]"
                      >
                        <span className="mt-1 rounded-full border border-slate-200 bg-white p-1.5 text-[#172033] transition-colors group-hover:border-[#3351c8]/30 group-hover:text-[#3351c8]">
                          <Icon className="h-3.5 w-3.5" strokeWidth={1.8} />
                        </span>
                        <span className="min-w-0">
                          <span className="editorial-display nav-link block text-[1.14rem] leading-none">
                            {route.label}
                          </span>
                          <span className="editorial-muted mt-2 block text-xs leading-5">
                            {route.blurb}
                          </span>
                        </span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="rounded-[1.75rem] border border-[#dfe5ff] bg-[color:var(--accent-soft)]/85 p-5 shadow-[0_20px_44px_rgba(51,81,200,0.06)]">
                <p className="editorial-kicker text-[#3351c8]">Nota editorial</p>
                <p className="editorial-display mt-3 text-[1rem] leading-7 text-[#243046]">
                  “El objetivo no es listar todo. Es ayudarte a encontrar primero lo que sí vale la
                  pena probar.”
                </p>
              </div>
            </aside>

            <article className="editorial-rule flex flex-col gap-6 lg:col-span-5 lg:border-r lg:pr-8">
              <Link
                href={featuredPost ? `/blog/${featuredPost.slug}` : "/blog"}
                className="group relative block aspect-[4/3] overflow-hidden rounded-[2rem] border border-slate-200 bg-[#ebe6dc] shadow-[0_30px_65px_rgba(15,23,42,0.08)]"
              >
                {featuredPost?.cover_image_url ? (
                  <Image
                    src={featuredPost.cover_image_url}
                    alt={featuredPost.title}
                    fill
                    priority
                    sizes="(min-width: 1024px) 48vw, 100vw"
                    className="object-cover transition duration-700 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#8aa8ff_0%,#6e7cff_28%,#18243e_100%)]" />
                )}
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,24,39,0.03)_0%,rgba(17,24,39,0.34)_100%)]" />
                <div className="absolute left-5 top-5 rounded-full border border-white/60 bg-white/82 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-[#243046] backdrop-blur-sm">
                  Cover story
                </div>
              </Link>

              <div className="flex flex-col gap-4">
                <p className="editorial-kicker text-[#3351c8]">
                  {featuredPost ? getPostLabel(featuredPost.post_kind) : "Portada"}
                </p>
                <h2 className="editorial-display max-w-3xl text-[2.85rem] leading-[0.95] font-semibold tracking-[-0.05em] text-[#111827] md:text-[4.25rem]">
                  {featuredPost?.title ?? "La lectura principal de IA NEXUS aparecerá aquí"}
                </h2>
                <p className="max-w-3xl text-[1rem] leading-7 text-[#4b5568] md:text-[1.06rem]">
                  {featuredPost?.excerpt ??
                    "Cuando haya una publicación destacada, esta portada la mostrará como historia principal con contexto suficiente para entrar a leer."}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-4">
                  <Link
                    href={featuredPost ? `/blog/${featuredPost.slug}` : "/blog"}
                    className="inline-flex items-center gap-2 rounded-full bg-[#172033] px-5 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#0f172a]"
                  >
                    Leer portada
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  {featuredPost ? (
                    <span className="rounded-full border border-slate-200 bg-white/72 px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#6b7280]">
                      {formatDate(featuredPost.published_at)}
                    </span>
                  ) : null}
                </div>
              </div>
            </article>

            <aside className="lg:col-span-3">
              <div className="flex items-center justify-between">
                <h3 className="editorial-display text-[2rem] font-semibold leading-none text-[#111827]">
                  Trending Tools
                </h3>
                <span className="editorial-kicker editorial-muted">Top 3</span>
              </div>

              <div className="editorial-rule mt-6 border-t">
                {trendingTools.map((tool, index) => (
                  <Link
                    key={tool.id}
                    href={`/herramientas/${tool.slug}`}
                    className="editorial-rule group -mx-3 flex gap-5 border-b px-3 py-5 transition-colors hover:bg-white/55"
                  >
                    <span className="editorial-display text-[2rem] font-light text-[#9aa3b6] transition-colors group-hover:text-[#3351c8]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="editorial-display block text-[1.32rem] leading-tight font-semibold text-[#172033] transition-colors group-hover:text-[#3351c8]">
                        {tool.name}
                      </span>
                      <span className="editorial-muted mt-2 block text-sm leading-6">
                        {tool.description ??
                          "Herramienta seleccionada por utilidad, guía vinculada y señal editorial."}
                      </span>
                      <span className="mt-3 block text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#6b7280]">
                        {[getPlanLabel(tool.plan), tool.category.name].filter(Boolean).join(" · ")}
                      </span>
                    </span>
                  </Link>
                ))}
              </div>

              <div className="mt-8 rounded-[1.75rem] border border-[#dfe5ff] bg-[color:var(--accent-lilac)]/86 p-5 shadow-[0_20px_44px_rgba(108,92,231,0.05)]">
                <p className="editorial-kicker text-[#6b4fd4]">Student highlight</p>
                <p className="editorial-display mt-3 text-[1.34rem] leading-tight font-semibold text-[#172033]">
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
            </aside>
          </section>

          <section className="editorial-rule mt-12 grid gap-8 border-t pt-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
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
                      className={`rounded-[1.5rem] border p-4 shadow-[0_20px_44px_rgba(15,23,42,0.05)] transition-transform hover:-translate-y-0.5 ${
                        index % 2 === 0
                          ? "border-slate-200/80 bg-white/82"
                          : "border-[#dff1e9] bg-[color:var(--accent-mint)]/9"
                      }`}
                    >
                      <p className="editorial-kicker text-[#3351c8]">{getPostLabel(post.post_kind)}</p>
                      <h4 className="editorial-display mt-3 text-[1.75rem] leading-tight font-semibold text-[#111827]">
                        {post.title}
                      </h4>
                      <p className="editorial-muted mt-3 text-sm leading-6">
                        {post.excerpt ?? "Lectura breve para profundizar en la conversación editorial."}
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

            <div className="rounded-[1.75rem] border border-slate-200/80 bg-white/82 p-5 shadow-[0_24px_50px_rgba(15,23,42,0.06)]">
              <p className="editorial-kicker editorial-muted">Señales rápidas</p>
              <div className="mt-5 space-y-4">
                {latestSignals.map((post, index) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="flex items-start gap-4 rounded-2xl px-2 py-2 transition-colors hover:bg-slate-50/90"
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
