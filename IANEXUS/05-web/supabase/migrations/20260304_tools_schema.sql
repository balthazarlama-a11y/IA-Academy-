-- YourAI - Fase 2: Tools Schema
-- Tablas: tool_categories, tools, post_tools
-- Run AFTER 20260303_init_blog.sql

-- ─────────────────────────────────────────────
-- ENUMS
-- ─────────────────────────────────────────────

do $$
begin
  create type public.tool_plan as enum ('free', 'freemium', 'paid', 'edu_free');
exception
  when duplicate_object then null;
end
$$;

do $$
begin
  create type public.tool_level as enum ('beginner', 'intermediate', 'advanced', 'all');
exception
  when duplicate_object then null;
end
$$;

-- ─────────────────────────────────────────────
-- TABLA: tool_categories
-- ─────────────────────────────────────────────

create table if not exists public.tool_categories (
  id   uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  color_accent text,          -- hex color para UI, ej. '#3b82f6'
  icon_name    text,          -- nombre de icono Lucide, ej. 'GraduationCap'
  sort_order   smallint not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists tool_categories_slug_idx on public.tool_categories(slug);

-- ─────────────────────────────────────────────
-- TABLA: tools
-- ─────────────────────────────────────────────

create table if not exists public.tools (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  slug            text not null unique,
  description     text,
  url             text not null,
  logo_url        text,
  plan            public.tool_plan    not null default 'free',
  level           public.tool_level   not null default 'all',
  ia_type         text,                -- ej. 'ChatGPT', 'Gemini', 'Custom'
  category_id     uuid not null references public.tool_categories(id) on delete restrict,
  verified        boolean not null default false,
  edu_verified    boolean not null default false,  -- tiene plan .edu confirmado
  featured        boolean not null default false,
  status          public.content_status not null default 'published',
  sort_order      smallint not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists tools_category_idx    on public.tools(category_id);
create index if not exists tools_plan_idx        on public.tools(plan);
create index if not exists tools_status_idx      on public.tools(status);
create index if not exists tools_featured_idx    on public.tools(featured) where featured = true;
create index if not exists tools_edu_idx         on public.tools(edu_verified) where edu_verified = true;
create index if not exists tools_slug_idx        on public.tools(slug);

-- ─────────────────────────────────────────────
-- TABLA: post_tools (N:N posts ↔ tools)
-- ─────────────────────────────────────────────

create table if not exists public.post_tools (
  post_id  uuid not null references public.posts(id)  on delete cascade,
  tool_id  uuid not null references public.tools(id)  on delete cascade,
  sort_order smallint not null default 0,
  created_at timestamptz not null default now(),
  primary key (post_id, tool_id)
);

create index if not exists post_tools_tool_idx on public.post_tools(tool_id);
create index if not exists post_tools_post_idx on public.post_tools(post_id);

-- ─────────────────────────────────────────────
-- TRIGGERS: updated_at (reusar función existente)
-- ─────────────────────────────────────────────

drop trigger if exists trg_tool_categories_updated_at on public.tool_categories;
create trigger trg_tool_categories_updated_at
  before update on public.tool_categories
  for each row execute function public.set_updated_at();

drop trigger if exists trg_tools_updated_at on public.tools;
create trigger trg_tools_updated_at
  before update on public.tools
  for each row execute function public.set_updated_at();

-- ─────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────────

alter table public.tool_categories enable row level security;
alter table public.tools           enable row level security;
alter table public.post_tools      enable row level security;

-- tool_categories: lectura pública, escritura solo staff
drop policy if exists tool_categories_public_read on public.tool_categories;
create policy tool_categories_public_read
  on public.tool_categories for select
  using (true);

drop policy if exists tool_categories_staff_write on public.tool_categories;
create policy tool_categories_staff_write
  on public.tool_categories for all
  using  (public.current_app_role() in ('admin', 'master'))
  with check (public.current_app_role() in ('admin', 'master'));

-- tools: lectura pública solo de tools publicadas, escritura staff
drop policy if exists tools_public_read on public.tools;
create policy tools_public_read
  on public.tools for select
  using (status = 'published');

drop policy if exists tools_staff_all on public.tools;
create policy tools_staff_all
  on public.tools for all
  using  (public.current_app_role() in ('admin', 'master'))
  with check (public.current_app_role() in ('admin', 'master'));

-- post_tools: lectura pública (igual que posts), escritura staff
drop policy if exists post_tools_public_read on public.post_tools;
create policy post_tools_public_read
  on public.post_tools for select
  using (
    exists (
      select 1 from public.posts p
      where p.id = post_id
        and p.status = 'published'
        and (p.published_at is null or p.published_at <= now())
    )
  );

drop policy if exists post_tools_staff_all on public.post_tools;
create policy post_tools_staff_all
  on public.post_tools for all
  using  (public.current_app_role() in ('admin', 'master'))
  with check (public.current_app_role() in ('admin', 'master'));
