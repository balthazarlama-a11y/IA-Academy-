import { getSupabaseServerAuthClient } from "@/lib/supabase/server";

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

function tinyBar(value: number, max: number) {
  if (max <= 0) return "0%";
  return `${Math.max(6, Math.round((value / max) * 100))}%`;
}

export async function AnalyticsKpiSection() {
  const kpis = await fetchWhatsappKpis();
  const hasData = kpis.clicks30 > 0;
  const maxLocation = Math.max(...kpis.byLocation.map((row) => Number(row.clicks)), 0);

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.95))] p-6 shadow-[0_18px_44px_rgba(15,23,42,0.04)]">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#3351c8]">
            WhatsApp analytics
          </p>
          <h3 className="mt-2 text-lg font-semibold text-slate-950">Señales de intención</h3>
          <p className="mt-1 text-sm text-slate-500">
            Lectura de clics por ubicación y páginas que mejor empujan la conversación.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500">
            7 días: {kpis.clicks7}
          </span>
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500">
            30 días: {kpis.clicks30}
          </span>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {[
          {
            label: "Clicks WhatsApp · 7 días",
            value: kpis.clicks7,
            hint: "click_whatsapp_cta",
            accent: "rgba(34,197,94,0.12)",
            tone: "text-emerald-600",
          },
          {
            label: "Clicks WhatsApp · 30 días",
            value: kpis.clicks30,
            hint: "click_whatsapp_cta",
            accent: "rgba(59,130,246,0.12)",
            tone: "text-blue-600",
          },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_14px_30px_rgba(15,23,42,0.04)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                  {card.label}
                </p>
                <p className="mt-3 text-3xl font-semibold text-slate-950 tabular-nums">{card.value}</p>
                <p className="mt-1 text-xs text-slate-500">{card.hint}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 p-2.5" style={{ background: card.accent }}>
                <svg className={`h-5 w-5 ${card.tone}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_14px_30px_rgba(15,23,42,0.04)]">
          <div className="mb-3 flex items-center gap-2">
            <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
              Clicks por ubicación · 30 días
            </p>
          </div>

          {!hasData ? (
            <p className="text-sm text-slate-400">Aún no hay datos registrados.</p>
          ) : (
            <ul className="space-y-3">
              {kpis.byLocation.map((row) => (
                <li key={row.location} className="space-y-1">
                  <div className="flex items-center justify-between gap-3">
                    <span className="truncate text-sm font-medium text-slate-700">{row.location}</span>
                    <span className="text-xs text-slate-500 tabular-nums">{row.clicks}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-emerald-400 to-blue-400"
                      style={{ width: tinyBar(Number(row.clicks), maxLocation) }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_14px_30px_rgba(15,23,42,0.04)]">
          <div className="mb-3 flex items-center gap-2">
            <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path d="M18 20V10M12 20V4M6 20v-6" />
            </svg>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
              Top páginas → WhatsApp · 30 días
            </p>
          </div>

          {!hasData ? (
            <p className="text-sm text-slate-400">Aún no hay datos registrados.</p>
          ) : (
            <ul className="space-y-2">
              {kpis.topPages.map((row) => (
                <li
                  key={row.page_path}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2.5"
                >
                  <span className="truncate text-xs font-medium text-slate-700">
                    {row.page_path}
                  </span>
                  <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-xs font-medium text-slate-600 tabular-nums">
                    {row.clicks}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
