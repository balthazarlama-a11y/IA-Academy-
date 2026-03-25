/**
 * Dashboard de Administración
 * Vista principal del panel de admin — métricas reales desde Supabase.
 */

import Link from "next/link";
import { FileText, Eye, Wrench, PenSquare, BookOpenText } from "lucide-react";
import { getSupabaseServerAuthClient } from "@/lib/supabase/server";
import { AnalyticsKpiSection } from "@/components/admin/analytics-kpi-section";

export const metadata = {
  title: "Dashboard — Admin IA NEXUS",
};

async function fetchDashboardStats() {
  try {
    const supabase = await getSupabaseServerAuthClient();

    const [
      { count: totalPosts },
      { count: publishedPosts },
      { count: draftPosts },
      { count: scheduledPosts },
      { count: totalTools },
      { count: publishedTools },
      { count: draftTools },
      { count: scheduledTools },
    ] = await Promise.all([
      supabase.from("posts").select("*", { count: "exact", head: true }),
      supabase
        .from("posts")
        .select("*", { count: "exact", head: true })
        .eq("status", "published"),
      supabase
        .from("posts")
        .select("*", { count: "exact", head: true })
        .eq("status", "draft"),
      supabase
        .from("posts")
        .select("*", { count: "exact", head: true })
        .eq("status", "scheduled"),
      supabase.from("tools").select("*", { count: "exact", head: true }),
      supabase
        .from("tools")
        .select("*", { count: "exact", head: true })
        .eq("status", "published"),
      supabase
        .from("tools")
        .select("*", { count: "exact", head: true })
        .eq("status", "draft"),
      supabase
        .from("tools")
        .select("*", { count: "exact", head: true })
        .eq("status", "scheduled"),
    ]);

    return {
      totalPosts: totalPosts ?? 0,
      publishedPosts: publishedPosts ?? 0,
      draftPosts: draftPosts ?? 0,
      scheduledPosts: scheduledPosts ?? 0,
      totalTools: totalTools ?? 0,
      publishedTools: publishedTools ?? 0,
      draftTools: draftTools ?? 0,
      scheduledTools: scheduledTools ?? 0,
    };
  } catch {
    return {
      totalPosts: 0,
      publishedPosts: 0,
      draftPosts: 0,
      scheduledPosts: 0,
      totalTools: 0,
      publishedTools: 0,
      draftTools: 0,
      scheduledTools: 0,
    };
  }
}

export default async function AdminDashboardPage() {
  const stats = await fetchDashboardStats();

  const heroStats = [
    {
      label: "Posts publicados",
      value: stats.publishedPosts,
      hint: `${stats.totalPosts} totales`,
      icon: FileText,
      accent: "rgba(59,130,246,0.13)",
      iconColor: "text-blue-500",
    },
    {
      label: "Tools publicadas",
      value: stats.publishedTools,
      hint: `${stats.totalTools} totales`,
      icon: Wrench,
      accent: "rgba(16,185,129,0.13)",
      iconColor: "text-emerald-500",
    },
    {
      label: "Borradores",
      value: stats.draftPosts + stats.draftTools,
      hint: "texto aún en edición",
      icon: PenSquare,
      accent: "rgba(139,92,246,0.13)",
      iconColor: "text-violet-500",
    },
  ];

  const statCards = [
    {
      name: "Posts totales",
      value: stats.totalPosts,
      sub: `${stats.publishedPosts} publicados · ${stats.draftPosts} borradores`,
      icon: FileText,
      accent: "rgba(59,130,246,0.10)",
      iconColor: "text-blue-500",
    },
    {
      name: "Tools totales",
      value: stats.totalTools,
      sub: `${stats.publishedTools} publicadas · ${stats.draftTools} borradores`,
      icon: Wrench,
      accent: "rgba(16,185,129,0.10)",
      iconColor: "text-emerald-500",
    },
    {
      name: "Posts en cola",
      value: stats.scheduledPosts,
      sub: "programados para publicar",
      icon: Eye,
      accent: "rgba(245,158,11,0.12)",
      iconColor: "text-amber-500",
    },
    {
      name: "Tools en cola",
      value: stats.scheduledTools,
      sub: "listadas pero aún no visibles",
      icon: BookOpenText,
      accent: "rgba(99,102,241,0.10)",
      iconColor: "text-indigo-500",
    },
  ];

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.10),transparent_36%),linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.96))] p-6 shadow-[0_24px_64px_rgba(15,23,42,0.06)]">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_360px]">
          <div className="max-w-3xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#3351c8]">
              Editorial control room
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
                Admin
              </span>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
                Posts
              </span>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
                Tools
              </span>
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
              Un tablero editorial para publicar con ritmo.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 md:text-[0.98rem]">
              Gestiona contenido, herramientas y señales de publicación desde una sola superficie.
              Lo importante arriba, lo operativo abajo, y cada acción con una salida clara.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/admin/posts"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                <FileText className="h-4 w-4" />
                Ir al archivo
              </Link>
              <Link
                href="/admin/posts/new"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-800 transition hover:bg-slate-50"
              >
                <PenSquare className="h-4 w-4" />
                Nuevo post
              </Link>
              <Link
                href="/admin/tools"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-800 transition hover:bg-slate-50"
              >
                <Wrench className="h-4 w-4" />
                Gestionar tools
              </Link>
              <Link
                href="/admin/relations"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-800 transition hover:bg-slate-50"
              >
                <BookOpenText className="h-4 w-4" />
                Relaciones
              </Link>
            </div>
          </div>

          <div className="grid gap-3">
            {heroStats.map((card) => (
              <div
                key={card.label}
                className="rounded-[1.5rem] border border-slate-200 bg-white/92 p-4 shadow-[0_14px_30px_rgba(15,23,42,0.04)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
                      {card.label}
                    </p>
                    <p className="mt-2 text-3xl font-semibold text-slate-950 tabular-nums">{card.value}</p>
                    <p className="mt-1 text-xs text-slate-500">{card.hint}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-2.5" style={{ background: card.accent }}>
                    <card.icon className={`h-5 w-5 ${card.iconColor}`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500">Métricas</p>
            <h3 className="text-lg font-semibold text-slate-950">Estado del archivo</h3>
          </div>
          <p className="text-sm text-slate-500">Lectura rápida de la cola editorial y del contenido publicado.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((card) => (
            <div
              key={card.name}
              className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_14px_30px_rgba(15,23,42,0.04)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">{card.name}</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-950 tabular-nums">{card.value}</p>
                  <p className="mt-1 text-xs text-slate-500">{card.sub}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-2.5" style={{ background: card.accent }}>
                  <card.icon className={`h-5 w-5 ${card.iconColor}`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <AnalyticsKpiSection />

      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500">Acciones rápidas</p>
            <h3 className="text-lg font-semibold text-slate-950">Rutas principales</h3>
          </div>
          <p className="text-sm text-slate-500">Todo lo que mueve la edición, sin abrir demasiadas pantallas.</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Link
            href="/admin/posts"
            className="group rounded-[1.65rem] border border-slate-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(249,250,251,0.96))] p-6 shadow-[0_14px_34px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:border-slate-300"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-blue-700">
                  Editorial
                </div>
                <h4 className="mt-4 text-xl font-semibold tracking-tight text-slate-950">
                  Archivo y workspace de posts
                </h4>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-600">
                  El archivo vive en `/admin/posts` y la escritura se abre en una página dedicada tipo documento.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-3 text-slate-400 transition group-hover:text-slate-700">
                <FileText className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-6 flex items-center gap-3 text-sm text-slate-500">
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5">
                {stats.totalPosts} posts
              </span>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5">
                {stats.publishedPosts} publicados
              </span>
            </div>
          </Link>

          <Link
            href="/admin/tools"
            className="group rounded-[1.65rem] border border-slate-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(249,250,251,0.96))] p-6 shadow-[0_14px_34px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:border-slate-300"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-emerald-700">
                  Catálogo
                </div>
                <h4 className="mt-4 text-xl font-semibold tracking-tight text-slate-950">
                  Gestionar Tools
                </h4>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-600">
                  Mantener herramientas, taxonomía y media listos para publicación.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-3 text-slate-400 transition group-hover:text-slate-700">
                <Wrench className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-6 flex items-center gap-3 text-sm text-slate-500">
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5">
                {stats.totalTools} tools
              </span>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5">
                {stats.publishedTools} publicadas
              </span>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
