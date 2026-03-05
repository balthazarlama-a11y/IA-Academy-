import { getSupabaseServerAuthClient } from "@/lib/supabase/server";
// Icons as SVGs to avoid lucide-react version issues

type LocationRow = { location: string; clicks: number };
type PageRow = { page_path: string; clicks: number };

async function fetchWhatsappKpis() {
  try {
    const supabase = await getSupabaseServerAuthClient();
    const now = new Date();
    const ago7 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const ago30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const [
      { count: clicks7 },
      { count: clicks30 },
      { data: byLocation },
      { data: topPages },
    ] = await Promise.all([
      supabase
        .from("analytics_events")
        .select("*", { count: "exact", head: true })
        .eq("event_name", "click_whatsapp_cta")
        .gte("created_at", ago7),
      supabase
        .from("analytics_events")
        .select("*", { count: "exact", head: true })
        .eq("event_name", "click_whatsapp_cta")
        .gte("created_at", ago30),
      supabase.rpc("get_whatsapp_clicks_by_location", { days_back: 30 }),
      supabase.rpc("get_whatsapp_top_pages", { days_back: 30, top_n: 5 }),
    ]);

    return {
      clicks7: clicks7 ?? 0,
      clicks30: clicks30 ?? 0,
      byLocation: (byLocation ?? []) as LocationRow[],
      topPages: (topPages ?? []) as PageRow[],
    };
  } catch {
    return { clicks7: 0, clicks30: 0, byLocation: [], topPages: [] };
  }
}

export async function AnalyticsKpiSection() {
  const kpis = await fetchWhatsappKpis();
  const hasData = kpis.clicks30 > 0;

  return (
    <section className="space-y-4">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
        WhatsApp Analytics
      </h3>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          className="p-5 rounded-xl"
          style={{
            background: "rgba(34,197,94,0.12)",
            border: "1px solid rgba(148,163,184,0.28)",
          }}
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs text-slate-500 mb-1">Clicks WhatsApp · 7 días</p>
              <p className="text-3xl font-bold text-slate-900 tabular-nums">{kpis.clicks7}</p>
              <p className="text-xs text-slate-400 mt-1">click_whatsapp_cta</p>
            </div>
            <div className="p-2 rounded-lg" style={{ background: "rgba(241,245,249,0.92)" }}>
              <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
            </div>
          </div>
        </div>

        <div
          className="p-5 rounded-xl"
          style={{
            background: "rgba(34,197,94,0.07)",
            border: "1px solid rgba(148,163,184,0.28)",
          }}
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs text-slate-500 mb-1">Clicks WhatsApp · 30 días</p>
              <p className="text-3xl font-bold text-slate-900 tabular-nums">{kpis.clicks30}</p>
              <p className="text-xs text-slate-400 mt-1">click_whatsapp_cta</p>
            </div>
            <div className="p-2 rounded-lg" style={{ background: "rgba(241,245,249,0.92)" }}>
              <svg className="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M23 6l-9.5 9.5-5-5L1 18"/><path d="M17 6h6v6"/></svg>
            </div>
          </div>
        </div>
      </div>

      {!hasData ? (
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-6 text-center text-sm text-slate-400">
          Aún no hay eventos registrados. Los datos aparecerán aquí una vez que se instrumenten los CTAs.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* CTR by location */}
          <div
            className="rounded-xl p-5"
            style={{
              background: "rgba(255,255,255,0.88)",
              border: "1px solid rgba(148,163,184,0.28)",
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                Clicks por ubicación · 30 días
              </p>
            </div>
            {kpis.byLocation.length === 0 ? (
              <p className="text-xs text-slate-400">Sin datos</p>
            ) : (
              <ul className="space-y-2">
                {kpis.byLocation.map((row) => {
                  const pct =
                    kpis.clicks30 > 0
                      ? Math.round((Number(row.clicks) / kpis.clicks30) * 100)
                      : 0;
                  return (
                    <li key={row.location} className="flex items-center gap-3 text-sm">
                      <span className="w-24 shrink-0 truncate text-slate-700 font-medium">
                        {row.location}
                      </span>
                      <div className="flex-1 rounded-full bg-slate-100 h-2 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-green-400"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-10 text-right text-xs text-slate-500 tabular-nums">
                        {row.clicks}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Top pages */}
          <div
            className="rounded-xl p-5"
            style={{
              background: "rgba(255,255,255,0.88)",
              border: "1px solid rgba(148,163,184,0.28)",
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M18 20V10M12 20V4M6 20v-6"/></svg>
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                Top páginas → WhatsApp · 30 días
              </p>
            </div>
            {kpis.topPages.length === 0 ? (
              <p className="text-xs text-slate-400">Sin datos</p>
            ) : (
              <ul className="space-y-2">
                {kpis.topPages.map((row) => (
                  <li key={row.page_path} className="flex items-center justify-between gap-3 text-sm">
                    <span className="truncate text-slate-700 font-mono text-xs">
                      {row.page_path}
                    </span>
                    <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 tabular-nums">
                      {row.clicks}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
