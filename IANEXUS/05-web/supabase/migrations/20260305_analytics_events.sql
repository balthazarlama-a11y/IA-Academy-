-- IA NEXUS - Analytics Events
-- Tabla para instrumentación del funnel (WhatsApp CTAs, tool views, etc.)

create table if not exists public.analytics_events (
  id          uuid        primary key default gen_random_uuid(),
  event_name  text        not null,
  location    text,                              -- hero / sticky / footer / blog_banner / etc.
  page_path   text,
  user_id     uuid        references auth.users(id) on delete set null,
  session_id  text,
  user_agent  text,
  meta        jsonb,
  created_at  timestamptz not null default now()
);

-- Índices para queries de dashboard (filtro por event_name + ventana temporal)
create index if not exists analytics_events_name_created_idx
  on public.analytics_events(event_name, created_at desc);

create index if not exists analytics_events_location_idx
  on public.analytics_events(location);

create index if not exists analytics_events_page_path_idx
  on public.analytics_events(page_path);

-- ─────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────────

alter table public.analytics_events enable row level security;

-- Cualquier visitante (incluso anónimo) puede insertar eventos
drop policy if exists analytics_events_insert on public.analytics_events;
create policy analytics_events_insert
  on public.analytics_events for insert
  with check (true);

-- Solo staff puede leer
drop policy if exists analytics_events_staff_read on public.analytics_events;
create policy analytics_events_staff_read
  on public.analytics_events for select
  using (public.current_app_role() in ('admin', 'master'));

-- ─────────────────────────────────────────────
-- RPC HELPERS para KPIs del dashboard
-- ─────────────────────────────────────────────

-- Clicks de WhatsApp agrupados por location en los últimos N días
create or replace function public.get_whatsapp_clicks_by_location(days_back integer default 30)
returns table(location text, clicks bigint)
language sql
stable
security definer
as $$
  select
    coalesce(e.location, 'unknown') as location,
    count(*)                        as clicks
  from public.analytics_events e
  where e.event_name = 'click_whatsapp_cta'
    and e.created_at >= now() - (days_back || ' days')::interval
  group by e.location
  order by clicks desc;
$$;

-- Top páginas que envían tráfico a WhatsApp en los últimos N días
create or replace function public.get_whatsapp_top_pages(days_back integer default 30, top_n integer default 10)
returns table(page_path text, clicks bigint)
language sql
stable
security definer
as $$
  select
    coalesce(e.page_path, '/') as page_path,
    count(*)                   as clicks
  from public.analytics_events e
  where e.event_name = 'click_whatsapp_cta'
    and e.created_at >= now() - (days_back || ' days')::interval
  group by e.page_path
  order by clicks desc
  limit top_n;
$$;
