-- IA NEXUS - Tools taxonomy reset v1
-- Replaces career-based taxonomy with explicit areas + use_cases.
-- Destructive by design: clears existing tools/post_tools data and drops legacy taxonomy tables.

alter table public.tools
  add column if not exists tagline text,
  add column if not exists company_name text,
  add column if not exists screenshot_url text,
  add column if not exists platform_tags text[] not null default '{}'::text[],
  add column if not exists language_codes text[] not null default '{}'::text[],
  add column if not exists spanish_available boolean not null default false,
  add column if not exists feature_bullets text[] not null default '{}'::text[],
  add column if not exists faq_items jsonb not null default '[]'::jsonb;

create table if not exists public.areas (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  icon_name text,
  color_accent text,
  sort_order smallint not null default 0,
  status public.content_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.use_cases (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  icon_name text,
  color_accent text,
  sort_order smallint not null default 0,
  status public.content_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tool_areas (
  tool_id uuid not null references public.tools(id) on delete cascade,
  area_id uuid not null references public.areas(id) on delete cascade,
  sort_order smallint not null default 0,
  created_at timestamptz not null default now(),
  primary key (tool_id, area_id)
);

create table if not exists public.tool_use_cases (
  tool_id uuid not null references public.tools(id) on delete cascade,
  use_case_id uuid not null references public.use_cases(id) on delete cascade,
  sort_order smallint not null default 0,
  created_at timestamptz not null default now(),
  primary key (tool_id, use_case_id)
);

create index if not exists areas_status_idx on public.areas(status);
create index if not exists use_cases_status_idx on public.use_cases(status);
create index if not exists tool_areas_area_idx on public.tool_areas(area_id);
create index if not exists tool_use_cases_use_case_idx on public.tool_use_cases(use_case_id);

drop trigger if exists trg_areas_updated_at on public.areas;
create trigger trg_areas_updated_at
  before update on public.areas
  for each row execute function public.set_updated_at();

drop trigger if exists trg_use_cases_updated_at on public.use_cases;
create trigger trg_use_cases_updated_at
  before update on public.use_cases
  for each row execute function public.set_updated_at();

alter table public.areas enable row level security;
alter table public.use_cases enable row level security;
alter table public.tool_areas enable row level security;
alter table public.tool_use_cases enable row level security;

drop policy if exists areas_select_unified on public.areas;
create policy areas_select_unified
on public.areas
for select
using (
  status = 'published'
  or public.current_app_role() in ('admin', 'master')
);

drop policy if exists areas_staff_insert on public.areas;
create policy areas_staff_insert
on public.areas
for insert
with check (public.current_app_role() in ('admin', 'master'));

drop policy if exists areas_staff_update on public.areas;
create policy areas_staff_update
on public.areas
for update
using (public.current_app_role() in ('admin', 'master'))
with check (public.current_app_role() in ('admin', 'master'));

drop policy if exists areas_staff_delete on public.areas;
create policy areas_staff_delete
on public.areas
for delete
using (public.current_app_role() in ('admin', 'master'));

drop policy if exists use_cases_select_unified on public.use_cases;
create policy use_cases_select_unified
on public.use_cases
for select
using (
  status = 'published'
  or public.current_app_role() in ('admin', 'master')
);

drop policy if exists use_cases_staff_insert on public.use_cases;
create policy use_cases_staff_insert
on public.use_cases
for insert
with check (public.current_app_role() in ('admin', 'master'));

drop policy if exists use_cases_staff_update on public.use_cases;
create policy use_cases_staff_update
on public.use_cases
for update
using (public.current_app_role() in ('admin', 'master'))
with check (public.current_app_role() in ('admin', 'master'));

drop policy if exists use_cases_staff_delete on public.use_cases;
create policy use_cases_staff_delete
on public.use_cases
for delete
using (public.current_app_role() in ('admin', 'master'));

drop policy if exists tool_areas_select_unified on public.tool_areas;
create policy tool_areas_select_unified
on public.tool_areas
for select
using (
  public.current_app_role() in ('admin', 'master')
  or exists (
    select 1
    from public.tools t
    where t.id = tool_id
      and t.status = 'published'
  )
);

drop policy if exists tool_areas_staff_insert on public.tool_areas;
create policy tool_areas_staff_insert
on public.tool_areas
for insert
with check (public.current_app_role() in ('admin', 'master'));

drop policy if exists tool_areas_staff_update on public.tool_areas;
create policy tool_areas_staff_update
on public.tool_areas
for update
using (public.current_app_role() in ('admin', 'master'))
with check (public.current_app_role() in ('admin', 'master'));

drop policy if exists tool_areas_staff_delete on public.tool_areas;
create policy tool_areas_staff_delete
on public.tool_areas
for delete
using (public.current_app_role() in ('admin', 'master'));

drop policy if exists tool_use_cases_select_unified on public.tool_use_cases;
create policy tool_use_cases_select_unified
on public.tool_use_cases
for select
using (
  public.current_app_role() in ('admin', 'master')
  or exists (
    select 1
    from public.tools t
    where t.id = tool_id
      and t.status = 'published'
  )
);

drop policy if exists tool_use_cases_staff_insert on public.tool_use_cases;
create policy tool_use_cases_staff_insert
on public.tool_use_cases
for insert
with check (public.current_app_role() in ('admin', 'master'));

drop policy if exists tool_use_cases_staff_update on public.tool_use_cases;
create policy tool_use_cases_staff_update
on public.tool_use_cases
for update
using (public.current_app_role() in ('admin', 'master'))
with check (public.current_app_role() in ('admin', 'master'));

drop policy if exists tool_use_cases_staff_delete on public.tool_use_cases;
create policy tool_use_cases_staff_delete
on public.tool_use_cases
for delete
using (public.current_app_role() in ('admin', 'master'));

insert into public.areas (name, slug, description, icon_name, color_accent, sort_order, status)
values
  ('Salud', 'salud', 'Herramientas utiles para clinica, investigacion medica y trabajo sanitario.', 'HeartPulse', '#2f855a', 1, 'published'),
  ('Programacion', 'programacion', 'Herramientas para escribir, revisar y acelerar desarrollo de software.', 'Code2', '#2563eb', 2, 'published'),
  ('Ingenieria', 'ingenieria', 'Herramientas para analisis tecnico, documentacion y resolucion de problemas.', 'Cog', '#0f766e', 3, 'published'),
  ('Diseño', 'diseno', 'Herramientas para imagen, video, prototipado y exploracion visual.', 'Palette', '#7c3aed', 4, 'published'),
  ('Derecho', 'derecho', 'Herramientas para revisar, resumir y analizar documentos legales.', 'Scale', '#7c2d12', 5, 'published'),
  ('Negocios', 'negocios', 'Herramientas para productividad, analisis y operaciones de negocio.', 'Briefcase', '#b45309', 6, 'published')
on conflict (slug) do update
set
  name = excluded.name,
  description = excluded.description,
  icon_name = excluded.icon_name,
  color_accent = excluded.color_accent,
  sort_order = excluded.sort_order,
  status = excluded.status;

insert into public.use_cases (name, slug, description, icon_name, color_accent, sort_order, status)
values
  ('Resumir', 'resumir', 'Condensar texto, videos, reuniones o documentos largos.', 'FileText', '#0284c7', 1, 'published'),
  ('Buscar e investigar', 'buscar-investigar', 'Explorar fuentes, contrastar informacion y acelerar investigacion.', 'Search', '#4338ca', 2, 'published'),
  ('Generar contenido creativo', 'generar-contenido-creativo', 'Crear texto, imagen, video o piezas creativas.', 'Sparkles', '#7c3aed', 3, 'published'),
  ('Programar y depurar', 'programar-depurar', 'Escribir codigo, revisar errores y acelerar desarrollo.', 'Bug', '#2563eb', 4, 'published'),
  ('Estudiar y practicar', 'estudiar-practicar', 'Aprender, resolver ejercicios y reforzar conceptos.', 'GraduationCap', '#0f766e', 5, 'published'),
  ('Organizar y automatizar', 'organizar-automatizar', 'Gestionar tareas, flujos y automatizaciones cotidianas.', 'Workflow', '#b45309', 6, 'published')
on conflict (slug) do update
set
  name = excluded.name,
  description = excluded.description,
  icon_name = excluded.icon_name,
  color_accent = excluded.color_accent,
  sort_order = excluded.sort_order,
  status = excluded.status;

truncate table public.tools, public.post_tools, public.tool_areas, public.tool_use_cases cascade;

drop table if exists public.tool_careers cascade;
drop table if exists public.career_paths cascade;
