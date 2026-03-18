import BlogEmptyState from "@/components/blog/blog-empty-state";
import BlogPostCard from "@/components/blog/blog-post-card";
import LatestUpdatesSection from "@/components/blog/latest-updates-section";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { CommunityCtaBanner } from "@/components/marketing/community-cta-banner";
import { fetchPublishedPosts } from "@/lib/supabase/server";
import {
  ArrowUpRight,
  BookOpenText,
  Layers3,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// ISR cada 5 minutos
export const revalidate = 300;

function formatDate(dateString: string | null) {
  if (!dateString) return "Reciente";

  const date = new Date(dateString);
  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatLabel(kind: string) {
  switch (kind) {
    case "news":
      return "Actualizacion";
    case "guide":
      return "Guia";
    case "tool":
      return "Herramienta";
    default:
      return "Articulo";
  }
}

export default async function BlogPage() {
  const posts = await fetchPublishedPosts();
  const featuredPost = posts[0] ?? null;
  const latestNews = posts
    .filter((post) => post.post_kind === "news" && post.id !== featuredPost?.id)
    .slice(0, 3);
  const archivePosts = posts.filter(
    (post) =>
      post.id !== featuredPost?.id &&
      !latestNews.some((latestPost) => latestPost.id === post.id),
  );

  const totalPosts = posts.length;
  const newsCount = posts.filter((post) => post.post_kind === "news").length;
  const libraryCount = posts.filter((post) => post.post_kind !== "news").length;

  return (
    <main
      className="relative min-h-screen flex flex-col overflow-hidden text-slate-900"
      style={{
        background:
          "radial-gradient(circle at top left, rgba(203,213,225,0.45), transparent 36%), radial-gradient(circle at top right, rgba(199,210,254,0.45), transparent 30%), linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%)",
      }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.9),transparent_58%)]" />
      <div className="pointer-events-none absolute left-[-12rem] top-28 h-72 w-72 rounded-full bg-cyan-200/35 blur-3xl" />
      <div className="pointer-events-none absolute right-[-10rem] top-44 h-80 w-80 rounded-full bg-indigo-200/30 blur-3xl" />

      <Header />

      <section className="relative flex-1 w-full px-4 py-8 md:px-6 md:py-12">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
          <header className="overflow-hidden rounded-[1.5rem] border border-white/80 bg-white/88 shadow-[0_28px_80px_rgba(15,23,42,0.08)] backdrop-blur-sm">
            <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="p-5 md:p-6 lg:p-8">
                <p className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-600">
                  <BookOpenText className="h-3.5 w-3.5" />
                  Archivo editorial
                </p>

                <h1 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl lg:text-5xl">
                  Notas, guias y actualizaciones sobre IA que vale la pena seguir.
                </h1>

                <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 md:text-lg">
                  Un archivo curado para descubrir lanzamientos, leer piezas utiles y seguir
                  las novedades mas importantes sin ruido.
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-600">
                  <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5">
                    <BookOpenText className="h-4 w-4 text-slate-500" />
                    {totalPosts} publicaciones
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    {newsCount} actualizaciones
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5">
                    <Layers3 className="h-4 w-4 text-cyan-600" />
                    {libraryCount} piezas de archivo
                  </span>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/areas"
                    className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
                  >
                    Explorar por areas
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/estudiantes"
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    Gratis para estudiantes
                  </Link>
                </div>
              </div>

              <div className="border-t border-slate-200/80 bg-slate-50/90 p-5 md:p-6 lg:border-l lg:border-t-0">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                    Lectura destacada
                  </p>
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700">
                    Portada
                  </span>
                </div>

                {featuredPost ? (
                  <article className="mt-5 overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
                    {featuredPost.cover_image_url ? (
                      <div className="relative aspect-[16/10] w-full overflow-hidden">
                        <Image
                          src={featuredPost.cover_image_url}
                          alt={featuredPost.title}
                          fill
                          unoptimized
                          sizes="(min-width: 1024px) 420px, 100vw"
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/25 via-transparent to-transparent" />
                      </div>
                    ) : (
                      <div className="grid aspect-[16/10] place-items-center bg-[linear-gradient(135deg,rgba(148,163,184,0.2),rgba(255,255,255,0.85))]">
                        <BookOpenText className="h-10 w-10 text-slate-400" />
                      </div>
                    )}

                    <div className="space-y-3.5 p-4">
                      <div className="flex flex-wrap items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500">
                        <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-slate-700">
                          {formatLabel(featuredPost.post_kind)}
                        </span>
                        <span>{formatDate(featuredPost.published_at)}</span>
                        {featuredPost.ia_type ? <span>{featuredPost.ia_type}</span> : null}
                      </div>

                      <h2 className="text-xl font-semibold leading-snug text-slate-950 md:text-2xl">
                        {featuredPost.title}
                      </h2>

                      <p className="line-clamp-3 text-sm leading-relaxed text-slate-600 md:text-base">
                        {featuredPost.excerpt ||
                          "Una pieza destacada para entender el movimiento de IA desde una lectura util y directa."}
                      </p>

                      <Link
                        href={`/blog/${featuredPost.slug}`}
                        prefetch={true}
                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-900 transition hover:text-slate-600"
                      >
                        Leer portada
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </article>
                ) : (
                  <div className="mt-5 rounded-[1.5rem] border border-dashed border-slate-300 bg-white p-6">
                    <p className="text-sm uppercase tracking-[0.16em] text-slate-500">
                      Sin portada disponible
                    </p>
                    <h2 className="mt-3 text-xl font-semibold text-slate-950">
                      El archivo editorial estara listo cuando publiquemos la primera pieza.
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      Mientras tanto, puedes navegar por areas o revisar el bloque de
                      actualizaciones cuando exista contenido.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </header>

          {latestNews.length > 0 ? (
            <LatestUpdatesSection
              posts={latestNews}
              title="Ultimas actualizaciones"
              subtitle="Cambios, lanzamientos y notas cortas que conviene leer primero."
            />
          ) : null}

          <section className="rounded-[1.5rem] border border-white/80 bg-white/90 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.05)] md:p-6">
            <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  Archivo de lectura
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
                  Guias, notas y piezas de fondo
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 md:text-base">
                  Contenido mas completo para cuando quieras ir mas alla de la novedad y
                  entender mejor cada herramienta o tendencia.
                </p>
              </div>

              <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600">
                {archivePosts.length} piezas
              </span>
            </div>

            {archivePosts.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {archivePosts.map((post) => (
                  <BlogPostCard key={post.id} post={post} />
                ))}
              </div>
            ) : posts.length > 0 ? (
              <BlogEmptyState
                title="Por ahora solo hay una pieza destacada"
                description="El archivo ya muestra la portada y las ultimas actualizaciones. Agregaremos mas guias y notas en breve."
                primaryHref="/areas"
                primaryLabel="Explorar areas"
                secondaryHref="/estudiantes"
                secondaryLabel="Ver gratis para estudiantes"
              />
            ) : (
              <BlogEmptyState />
            )}
          </section>

          <div className="mt-2">
            <CommunityCtaBanner location="blog_banner" />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
