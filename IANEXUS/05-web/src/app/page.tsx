import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  Layers3,
  Sparkles,
  Search,
} from "lucide-react";
import EditorialTopbar from "@/components/home/editorial-topbar";
import { EditorialCard } from "@/components/home/editorial-card";
import { EditorialSectionHeader } from "@/components/home/editorial-section-header";
import { TrackedWhatsAppLink } from "@/components/marketing/tracked-whatsapp-link";
import { fetchPublishedPosts } from "@/lib/supabase/server";
import { getToolsPage } from "@/lib/repositories/tools-repo";

export const revalidate = 300;

type HomeIconProps = {
  className?: string;
};

function IconProgramacion({ className }: HomeIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M8 8l-4 4 4 4" />
      <path d="M16 8l4 4-4 4" />
      <path d="M10 19l4-14" />
    </svg>
  );
}

function IconInvestigacion({ className }: HomeIconProps) {
  return <Search className={className} />;
}

function IconSalud({ className }: HomeIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 4v16" />
      <path d="M4 12h16" />
      <path d="M7 7h10" />
      <path d="M7 17h10" />
    </svg>
  );
}

function IconDiseno({ className }: HomeIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="8" cy="8" r="3" />
      <circle cx="16" cy="8" r="3" />
      <circle cx="8" cy="16" r="3" />
      <path d="M13 16h5" />
    </svg>
  );
}

function IconNegocios({ className }: HomeIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="4" y="7" width="16" height="11" rx="2" />
      <path d="M9 7V5h6v2" />
      <path d="M4 12h16" />
    </svg>
  );
}

function IconDerecho({ className }: HomeIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 5v14" />
      <path d="M6 8h12" />
      <path d="M7 8l-2 4h4l-2-4z" />
      <path d="M17 8l-2 4h4l-2-4z" />
    </svg>
  );
}

const editorialRoutes = [
  {
    label: "Estudiantes",
    href: "/estudiantes",
    icon: GraduationCap,
    blurb: "Gratis, freemium y planes que realmente sirven.",
  },
  {
    label: "Areas",
    href: "/areas",
    icon: Layers3,
    blurb: "Herramientas por especialidad y necesidad concreta.",
  },
  {
    label: "Dia a dia",
    href: "/dia-a-dia",
    icon: Sparkles,
    blurb: "Lo que vale la pena usar hoy sin perder tiempo.",
  },
  {
    label: "Blog",
    href: "/blog",
    icon: BookOpen,
    blurb: "Novedades, guias y actualizaciones editoriales.",
  },
];

const areaRoutes = [
  {
    label: "Programacion",
    href: "/areas?area=programacion",
    icon: IconProgramacion,
    blurb: "Copilotos, code review y flujo tecnico.",
  },
  {
    label: "Investigacion",
    href: "/areas?area=investigacion",
    icon: IconInvestigacion,
    blurb: "Busqueda, papers y analisis con contexto.",
  },
  {
    label: "Salud",
    href: "/areas?area=salud",
    icon: IconSalud,
    blurb: "Evidencia, resumenes y herramientas clinicas.",
  },
  {
    label: "Diseno",
    href: "/areas?area=diseno",
    icon: IconDiseno,
    blurb: "Visual, branding y produccion creativa.",
  },
  {
    label: "Negocios",
    href: "/areas?area=negocios",
    icon: IconNegocios,
    blurb: "Ventas, marketing y automatizacion.",
  },
  {
    label: "Derecho",
    href: "/areas?area=derecho",
    icon: IconDerecho,
    blurb: "Resumen de casos, lectura y contexto legal.",
  },
];

function formatDate(dateString: string | null) {
  if (!dateString) {
    return "Reciente";
  }

  const date = new Date(dateString);

  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getPostLabel(postKind: string) {
  switch (postKind) {
    case "news":
      return "Actualizacion";
    case "guide":
      return "Guia";
    case "tool":
      return "Herramienta";
    default:
      return "Post";
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
      return "Student free";
    default:
      return plan;
  }
}

export default async function Home() {
  const [posts, toolsPage] = await Promise.all([
    fetchPublishedPosts(),
    getToolsPage({}, { limit: 12, offset: 0 }),
  ]);

  const featuredPost = posts[0] ?? null;
  const newsPosts = posts.filter((post) => post.post_kind === "news").slice(0, 3);
  const guidePosts = posts.filter((post) => post.post_kind !== "news").slice(0, 4);
  const featuredTools = toolsPage.tools.slice(0, 6);
  const studentTools = toolsPage.tools
    .filter((tool) => tool.plan === "free" || tool.plan === "edu_free" || tool.edu_verified)
    .slice(0, 4);

  const routeStats = [
    { label: "Publicaciones", value: posts.length },
    { label: "Herramientas", value: toolsPage.tools.length },
    { label: "Gratis para estudiantes", value: studentTools.length },
    { label: "Guias y actualizaciones", value: guidePosts.length },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f6efe7] text-slate-950">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[38rem] bg-[radial-gradient(circle_at_top_left,rgba(125,92,255,0.13),transparent_38%),radial-gradient(circle_at_top_right,rgba(3,105,161,0.12),transparent_34%),radial-gradient(circle_at_center,rgba(251,146,60,0.08),transparent_42%)]" />
      <div className="pointer-events-none absolute -left-28 top-28 h-80 w-80 rounded-full bg-violet-200/35 blur-3xl" />
      <div className="pointer-events-none absolute -right-28 top-40 h-96 w-96 rounded-full bg-sky-200/35 blur-3xl" />

      <div className="relative z-10">
        <EditorialTopbar />

        <section className="mx-auto w-full max-w-5xl px-6 pb-6 pt-6 md:pb-8 md:pt-8">
          <div className="grid gap-4 lg:grid-cols-[0.96fr_1.04fr]">
            <div className="rounded-2xl border border-slate-200 bg-white/94 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.05)] md:p-6 lg:p-7">
              <p className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                <Sparkles className="h-3.5 w-3.5 text-sky-600" />
                Portada editorial de IA
              </p>

              <h1 className="mt-4 max-w-2xl text-3xl font-semibold leading-[1.03] tracking-tight text-slate-950 md:text-[3.25rem] lg:text-[3.7rem]">
                Descubre las IAs que si valen la pena
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-6 text-slate-600 md:text-[1.03rem] md:leading-7">
                Herramientas, guias y novedades curadas para estudiantes y usuarios que quieren
                usar IA con criterio, no por ruido.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700 md:text-sm">
                  Noticias curadas
                </span>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700 md:text-sm">
                  Gratis y freemium
                </span>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700 md:text-sm">
                  Por area y necesidad
                </span>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/blog"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                >
                  Explorar portada
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/estudiantes"
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                >
                  Ver herramientas para estudiantes
                </Link>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
                {routeStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5"
                  >
                    <p className="text-xl font-semibold tracking-tight text-slate-950 md:text-[1.7rem]">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-slate-500 md:text-xs">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              {featuredPost ? (
                <EditorialCard
                  href={`/blog/${featuredPost.slug}`}
                  eyebrow={getPostLabel(featuredPost.post_kind)}
                  title={featuredPost.title}
                  description={
                    featuredPost.excerpt ??
                    "La lectura principal del dia para entender que cambio, que herramienta o que guia conviene revisar primero."
                  }
                  meta={
                    [formatDate(featuredPost.published_at), featuredPost.ia_type]
                      .filter(Boolean)
                      .join(" / ")
                  }
                  footer="Leer ahora"
                  mediaUrl={featuredPost.cover_image_url}
                  icon={BookOpen}
                  variant="featured"
                  className="min-h-[20rem]"
                />
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.05)]">
                  <p className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Portada principal
                  </p>
                  <h2 className="mt-3 text-xl font-semibold text-slate-950 md:text-2xl">
                    La lectura principal de IA NEXUS aparecera aqui
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Cuando haya publicaciones activas, esta zona mostrara la historia o actualizacion
                    mas relevante del momento.
                  </p>
                </div>
              )}

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Ruta rapida
                  </p>
                  <div className="mt-3 grid gap-2">
                    {editorialRoutes.slice(0, 2).map((route) => {
                      const Icon = route.icon;
                      return (
                        <Link
                          key={route.href}
                          href={route.href}
                          className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 transition-colors hover:bg-white"
                        >
                          <div className="flex items-center gap-3">
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-900 shadow-sm">
                              <Icon className="h-3.5 w-3.5" />
                            </span>
                            <div>
                              <p className="text-sm font-medium text-slate-950">{route.label}</p>
                              <p className="text-[11px] text-slate-500">{route.blurb}</p>
                            </div>
                          </div>
                          <ArrowRight className="h-4 w-4 text-slate-400" />
                        </Link>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Mas visto
                  </p>
                  <div className="mt-3 grid gap-2">
                    {editorialRoutes.slice(2).map((route) => {
                      const Icon = route.icon;
                      return (
                        <Link
                          key={route.href}
                          href={route.href}
                          className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 transition-colors hover:bg-white"
                        >
                          <div className="flex items-center gap-3">
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-900 shadow-sm">
                              <Icon className="h-3.5 w-3.5" />
                            </span>
                            <div>
                              <p className="text-sm font-medium text-slate-950">{route.label}</p>
                              <p className="text-[11px] text-slate-500">{route.blurb}</p>
                            </div>
                          </div>
                          <ArrowRight className="h-4 w-4 text-slate-400" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-5xl px-6 py-6 md:py-8">
          <EditorialSectionHeader
            eyebrow="Ultimas novedades"
            title="Lo nuevo en IA"
            description="Lecturas breves para enterarte rapido de lo importante sin sentir que estas navegando una landing de producto."
            href="/blog"
            cta="Ver blog"
          />

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {(newsPosts.length > 0 ? newsPosts : guidePosts.slice(0, 3)).map((post) => (
              <EditorialCard
                key={post.id}
                href={`/blog/${post.slug}`}
                eyebrow={getPostLabel(post.post_kind)}
                title={post.title}
                description={
                  post.excerpt ??
                  "Una actualizacion breve para entender lo que cambia y por que importa."
                }
                meta={[formatDate(post.published_at), post.ia_type].filter(Boolean).join(" / ")}
                footer="Leer post"
                mediaUrl={post.cover_image_url}
                icon={BookOpen}
                variant="compact"
              />
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-5xl px-6 py-6 md:py-8">
          <EditorialSectionHeader
            eyebrow="Herramientas"
            title="Herramientas destacadas esta semana"
            description="Una seleccion curada de opciones utiles, con foco en lo que de verdad merece tu tiempo."
            href="/areas"
            cta="Explorar areas"
          />

          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {featuredTools.map((tool) => (
              <EditorialCard
                key={tool.id}
                href={`/herramientas/${tool.slug}`}
                eyebrow={tool.category.name}
                title={tool.name}
                description={
                  tool.description ??
                  "Una herramienta curada por IA NEXUS para resolver tareas reales sin ruido."
                }
                meta={[getPlanLabel(tool.plan), tool.ia_type].filter(Boolean).join(" / ")}
                footer={tool.verified ? "Verificada" : "Curada"}
                mediaUrl={tool.cover_image_url}
                icon={BookOpen}
                variant="default"
              >
                <div className="flex flex-wrap gap-2">
                  {tool.guide_slug ? (
                    <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                      Tiene guia
                    </span>
                  ) : null}
                  {tool.edu_verified ? (
                    <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700">
                      Para estudiantes
                    </span>
                  ) : null}
                </div>
              </EditorialCard>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-5xl px-6 py-6 md:py-8">
          <EditorialSectionHeader
            eyebrow="Para estudiantes"
            title="Gratis, freemium y utilidades para estudiar mejor"
            description="Herramientas que ayudan a ahorrar tiempo y dinero, con foco en acceso sencillo y valor real."
            href="/estudiantes"
            cta="Ver todo para estudiantes"
          />

          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {studentTools.length > 0 ? (
              studentTools.map((tool) => (
                <EditorialCard
                  key={tool.id}
                  href={`/herramientas/${tool.slug}`}
                  eyebrow={getPlanLabel(tool.plan)}
                  title={tool.name}
                  description={
                    tool.description ??
                    "Una opcion pensada para avanzar sin quedar atrapado en planes caros."
                  }
                  meta={tool.category.name}
                  footer={tool.edu_verified ? "Valida para campus" : "Acceso simple"}
                  mediaUrl={tool.cover_image_url}
                  icon={GraduationCap}
                  variant="compact"
                />
              ))
            ) : (
              <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 text-sm text-slate-600">
                Todavia no hay herramientas marcadas para estudiantes.
              </div>
            )}
          </div>
        </section>

        <section className="mx-auto w-full max-w-5xl px-6 py-6 md:py-8">
          <EditorialSectionHeader
            eyebrow="Por areas"
            title="Explora segun tu area"
            description="Categorias editoriales para llegar rapido a la herramienta o guia que encaja con lo que haces."
            href="/areas"
            cta="Ver todas las areas"
          />

          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {areaRoutes.map((area) => {
              const Icon = area.icon;

              return (
                <EditorialCard
                  key={area.href}
                  href={area.href}
                  eyebrow="Area"
                  title={area.label}
                  description={area.blurb}
                  meta="Exploracion curada"
                  footer="Abrir area"
                  icon={Icon}
                  variant="compact"
                />
              );
            })}
          </div>
        </section>

        <section className="mx-auto w-full max-w-5xl px-6 py-6 md:py-8">
          <EditorialSectionHeader
            eyebrow="Guia y contexto"
            title="Guias para usar mejor la IA"
            description="Contenido de fondo para entender procesos, comparar opciones y tomar mejores decisiones."
            href="/blog"
            cta="Ir al archivo"
          />

          <div className="mt-5 grid gap-3 lg:grid-cols-[1.18fr_0.82fr]">
            {guidePosts.length > 0 ? (
              <EditorialCard
                href={`/blog/${guidePosts[0].slug}`}
                eyebrow={getPostLabel(guidePosts[0].post_kind)}
                title={guidePosts[0].title}
                description={
                  guidePosts[0].excerpt ??
                  "Una guia pensada para resolver una necesidad concreta sin rodeos."
                }
                meta={[formatDate(guidePosts[0].published_at), guidePosts[0].ia_type]
                  .filter(Boolean)
                  .join(" / ")}
                footer="Lectura principal"
                mediaUrl={guidePosts[0].cover_image_url}
                icon={BookOpen}
                variant="featured"
              />
            ) : (
              <div className="rounded-[2.25rem] border border-slate-200 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.06)]">
                <h3 className="text-xl font-semibold text-slate-950">Guia principal pendiente</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Cuando haya contenidos publicados, esta zona mostrara una lectura mas profunda.
                </p>
              </div>
            )}

            <div className="grid gap-4">
              {guidePosts.slice(1, 4).map((post) => (
                <EditorialCard
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  eyebrow={getPostLabel(post.post_kind)}
                  title={post.title}
                  description={
                    post.excerpt ??
                    "Una lectura breve para profundizar sobre herramientas, procesos y criterios."
                  }
                  meta={[formatDate(post.published_at), post.ia_type].filter(Boolean).join(" / ")}
                  footer="Ver guia"
                  mediaUrl={post.cover_image_url}
                  icon={BookOpen}
                  variant="compact"
                />
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-5xl px-6 pb-12 pt-6 md:pb-16 md:pt-8">
          <div className="rounded-2xl border border-slate-200 bg-slate-950 px-5 py-7 text-white shadow-[0_18px_48px_rgba(15,23,42,0.16)] md:px-7 md:py-8">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-300">
                  Comienza aqui
                </p>
                <h2 className="mt-3 max-w-2xl text-2xl font-semibold tracking-tight md:text-[2.35rem]">
                  Entra a la comunidad y recibe novedades utiles sin perder el hilo.
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                  Si quieres descubrir mejores herramientas, guias y planes gratis antes que el ruido,
                  este es el punto de entrada.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <TrackedWhatsAppLink
                  location="hero"
                  className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition-opacity hover:opacity-90"
                >
                  Entrar a la comunidad
                </TrackedWhatsAppLink>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Iniciar sesion
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
