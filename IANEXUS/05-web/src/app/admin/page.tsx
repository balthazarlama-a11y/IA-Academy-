/**
 * Dashboard de Administración
 * Vista principal del panel de admin — métricas reales desde Supabase.
 */

import Link from "next/link";
import { FileText, Eye, Wrench, PenSquare } from "lucide-react";
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
      { count: totalTools },
      { count: publishedTools },
    ] = await Promise.all([
      supabase.from("posts").select("*", { count: "exact", head: true }),
      supabase
        .from("posts")
        .select("*", { count: "exact", head: true })
        .eq("status", "published"),
      supabase.from("tools").select("*", { count: "exact", head: true }),
      supabase
        .from("tools")
        .select("*", { count: "exact", head: true })
        .eq("status", "published"),
    ]);

    return {
      totalPosts: totalPosts ?? 0,
      publishedPosts: publishedPosts ?? 0,
      totalTools: totalTools ?? 0,
      publishedTools: publishedTools ?? 0,
    };
  } catch {
    return { totalPosts: 0, publishedPosts: 0, totalTools: 0, publishedTools: 0 };
  }
}

export default async function AdminDashboardPage() {
  const stats = await fetchDashboardStats();

  const statCards = [
    {
      name: "Total Posts",
      value: stats.totalPosts,
      sub: `${stats.publishedPosts} publicados`,
      icon: FileText,
      accent: "rgba(59,130,246,0.15)",
      iconColor: "text-blue-400",
    },
    {
      name: "Posts Publicados",
      value: stats.publishedPosts,
      sub: `de ${stats.totalPosts} totales`,
      icon: Eye,
      accent: "rgba(139,92,246,0.15)",
      iconColor: "text-violet-400",
    },
    {
      name: "Total Tools",
      value: stats.totalTools,
      sub: `${stats.publishedTools} publicadas`,
      icon: Wrench,
      accent: "rgba(16,185,129,0.15)",
      iconColor: "text-emerald-400",
    },
    {
      name: "Tools Publicadas",
      value: stats.publishedTools,
      sub: `de ${stats.totalTools} totales`,
      icon: PenSquare,
      accent: "rgba(245,158,11,0.15)",
      iconColor: "text-amber-400",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Bienvenido al Panel</h2>
        <p className="text-slate-500 text-sm">Gestiona el contenido de IA NEXUS y clasifica tools por áreas y casos de uso desde aquí.</p>
      </section>

      {/* Stats Grid */}
      <section>
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
          Métricas
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card) => (
            <div
              key={card.name}
              className="p-5 rounded-xl"
              style={{
                background: card.accent,
                border: "1px solid rgba(148, 163, 184, 0.28)",
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs text-slate-500 mb-1">{card.name}</p>
                  <p className="text-3xl font-bold text-slate-900 tabular-nums">{card.value}</p>
                  <p className="text-xs text-slate-400 mt-1">{card.sub}</p>
                </div>
                <div className="p-2 rounded-lg" style={{ background: "rgba(241,245,249,0.92)" }}>
                  <card.icon className={`h-5 w-5 ${card.iconColor}`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Analytics KPIs */}
      <AnalyticsKpiSection />

      {/* Quick Actions */}
      <section>
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
          Acciones Rápidas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/admin/posts"
            className="group p-6 rounded-xl transition-all duration-200 hover:bg-white block"
            style={{ background: "rgba(255, 255, 255, 0.88)", border: "1px solid rgba(148, 163, 184, 0.28)" }}
          >
            <div
              className="h-12 w-12 rounded-xl flex items-center justify-center mb-4"
              style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.22), rgba(139,92,246,0.22))" }}
            >
              <FileText className="h-6 w-6 text-blue-400" />
            </div>
            <h4 className="text-lg font-semibold text-slate-900 mb-1 group-hover:text-slate-900 transition-colors">
              Gestionar Posts
            </h4>
            <p className="text-sm text-slate-500">
              {stats.totalPosts === 0
                ? "Aún no hay posts. Crea el primero."
                : `${stats.totalPosts} posts · ${stats.publishedPosts} publicados`}
            </p>
          </Link>

          <Link
            href="/admin/tools"
            className="group p-6 rounded-xl transition-all duration-200 hover:bg-white block"
            style={{ background: "rgba(255, 255, 255, 0.88)", border: "1px solid rgba(148, 163, 184, 0.28)" }}
          >
            <div
              className="h-12 w-12 rounded-xl flex items-center justify-center mb-4"
              style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.22), rgba(59,130,246,0.22))" }}
            >
              <Wrench className="h-6 w-6 text-emerald-400" />
            </div>
            <h4 className="text-lg font-semibold text-slate-900 mb-1 group-hover:text-slate-900 transition-colors">
              Gestionar Tools
            </h4>
            <p className="text-sm text-slate-500">
              {stats.totalTools === 0
                ? "Aún no hay tools. Añade la primera y asígnale áreas y casos de uso."
                : `${stats.totalTools} tools · ${stats.publishedTools} publicadas · listas para asignar a áreas`}
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}

