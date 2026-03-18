-- IA NEXUS - Careers taxonomy for areas by career
-- Additive migration: keeps tool_categories intact and adds career_paths + tool_careers

-- -----------------------------------------------------------------------------
-- TABLE: career_paths
-- -----------------------------------------------------------------------------

create table if not exists public.career_paths (
  id            uuid primary key default gen_random_uuid(),
  name          text not null unique,
  slug          text not null unique,
  description   text,
  icon_name     text,
  color_accent  text,
  sort_order    smallint not null default 0,
  status        public.content_status not null default 'published',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists career_paths_slug_idx on public.career_paths(slug);
create index if not exists career_paths_status_idx on public.career_paths(status);
create index if not exists career_paths_sort_order_idx on public.career_paths(sort_order);

-- -----------------------------------------------------------------------------
-- TABLE: tool_careers (N:N tools <-> careers)
-- -----------------------------------------------------------------------------

create table if not exists public.tool_careers (
  tool_id        uuid not null references public.tools(id) on delete cascade,
  career_path_id uuid not null references public.career_paths(id) on delete cascade,
  sort_order     smallint not null default 0,
  created_at     timestamptz not null default now(),
  primary key (tool_id, career_path_id)
);

create index if not exists tool_careers_tool_idx on public.tool_careers(tool_id);
create index if not exists tool_careers_career_idx on public.tool_careers(career_path_id);

-- -----------------------------------------------------------------------------
-- TRIGGER: updated_at
-- -----------------------------------------------------------------------------

drop trigger if exists trg_career_paths_updated_at on public.career_paths;
create trigger trg_career_paths_updated_at
  before update on public.career_paths
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- SEED: career paths
-- -----------------------------------------------------------------------------

insert into public.career_paths (name, slug, description, icon_name, color_accent, sort_order, status)
values
  ('General y productividad', 'general', 'Herramientas transversales para estudiar, crear y organizar trabajo en cualquier contexto.', 'Sparkles', '#6366f1', 0, 'published'),
  ('Programacion', 'programacion', 'Desarrollo, automatizacion, debugging y construccion de productos digitales.', 'Code2', '#3b82f6', 1, 'published'),
  ('Investigacion', 'investigacion', 'Busqueda, lectura critica y sintesis de evidencia para proyectos y papers.', 'Search', '#8b5cf6', 2, 'published'),
  ('Diseno', 'diseno', 'UI/UX, imagen, branding y produccion visual con IA.', 'Palette', '#ec4899', 3, 'published'),
  ('Marketing', 'marketing', 'Contenido, growth, campanas y analisis comercial.', 'Megaphone', '#f59e0b', 4, 'published'),
  ('Educacion', 'educacion', 'Docencia, aprendizaje, materiales y soporte academico.', 'GraduationCap', '#14b8a6', 5, 'published'),
  ('Salud', 'salud', 'Medicina, biologia y apoyo clinico basado en evidencia.', 'Microscope', '#10b981', 6, 'published'),
  ('Negocios', 'negocios', 'Operacion, estrategia, productividad y analisis de negocio.', 'BriefcaseBusiness', '#f97316', 7, 'published'),
  ('Derecho', 'derecho', 'Redaccion juridica, analisis de documentos y research legal.', 'Scale', '#0f172a', 8, 'published'),
  ('Matematicas', 'matematicas', 'Algebra, calculo, estadistica y resolucion paso a paso.', 'Calculator', '#f59e0b', 9, 'published'),
  ('Escritura y contenido', 'escritura', 'Redaccion, edicion, estilo y contenido para multiples formatos.', 'PenLine', '#f97316', 10, 'published')
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  icon_name = excluded.icon_name,
  color_accent = excluded.color_accent,
  sort_order = excluded.sort_order,
  status = excluded.status;

-- -----------------------------------------------------------------------------
-- RLS
-- -----------------------------------------------------------------------------

alter table public.career_paths enable row level security;
alter table public.tool_careers enable row level security;

drop policy if exists career_paths_select_unified on public.career_paths;
create policy career_paths_select_unified
on public.career_paths
for select
using (
  public.current_app_role() in ('admin', 'master')
  or status = 'published'
);

drop policy if exists career_paths_staff_insert on public.career_paths;
create policy career_paths_staff_insert
on public.career_paths
for insert
to authenticated
with check (public.current_app_role() in ('admin', 'master'));

drop policy if exists career_paths_staff_update on public.career_paths;
create policy career_paths_staff_update
on public.career_paths
for update
to authenticated
using (public.current_app_role() in ('admin', 'master'))
with check (public.current_app_role() in ('admin', 'master'));

drop policy if exists career_paths_staff_delete on public.career_paths;
create policy career_paths_staff_delete
on public.career_paths
for delete
to authenticated
using (public.current_app_role() in ('admin', 'master'));

drop policy if exists tool_careers_select_unified on public.tool_careers;
create policy tool_careers_select_unified
on public.tool_careers
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

drop policy if exists tool_careers_staff_insert on public.tool_careers;
create policy tool_careers_staff_insert
on public.tool_careers
for insert
to authenticated
with check (public.current_app_role() in ('admin', 'master'));

drop policy if exists tool_careers_staff_update on public.tool_careers;
create policy tool_careers_staff_update
on public.tool_careers
for update
to authenticated
using (public.current_app_role() in ('admin', 'master'))
with check (public.current_app_role() in ('admin', 'master'));

drop policy if exists tool_careers_staff_delete on public.tool_careers;
create policy tool_careers_staff_delete
on public.tool_careers
for delete
to authenticated
using (public.current_app_role() in ('admin', 'master'));

-- -----------------------------------------------------------------------------
-- SEED: tool <-> career mappings
-- -----------------------------------------------------------------------------

with general_tools as (
  select unnest(array[
    'chatgpt-plus-edu',
    'gemini-advanced',
    'microsoft-copilot',
    'notion-ai'
  ]) as tool_slug
), all_careers as (
  select slug as career_slug
  from public.career_paths
)
insert into public.tool_careers (tool_id, career_path_id, sort_order)
select t.id, c.id, 0
from general_tools gt
join public.tools t on t.slug = gt.tool_slug
cross join all_careers ac
join public.career_paths c on c.slug = ac.career_slug
on conflict (tool_id, career_path_id) do nothing;

insert into public.tool_careers (tool_id, career_path_id, sort_order)
select t.id, c.id, 1
from public.tools t
join public.career_paths c on c.slug = 'programacion'
where t.slug in ('github-copilot', 'cursor-ide', 'replit-ai', 'tabnine', 'codeium')
on conflict (tool_id, career_path_id) do nothing;

insert into public.tool_careers (tool_id, career_path_id, sort_order)
select t.id, c.id, 1
from public.tools t
join public.career_paths c on c.slug = 'investigacion'
where t.slug in ('perplexity-pro', 'consensus', 'elicit', 'semantic-scholar', 'research-rabbit')
on conflict (tool_id, career_path_id) do nothing;

insert into public.tool_careers (tool_id, career_path_id, sort_order)
select t.id, c.id, 1
from public.tools t
join public.career_paths c on c.slug = 'diseno'
where t.slug in ('canva-ai', 'adobe-firefly', 'figma-ai')
on conflict (tool_id, career_path_id) do nothing;

insert into public.tool_careers (tool_id, career_path_id, sort_order)
select t.id, c.id, 1
from public.tools t
join public.career_paths c on c.slug = 'marketing'
where t.slug in ('canva-ai', 'adobe-firefly', 'figma-ai', 'notion-ai')
on conflict (tool_id, career_path_id) do nothing;

insert into public.tool_careers (tool_id, career_path_id, sort_order)
select t.id, c.id, 1
from public.tools t
join public.career_paths c on c.slug = 'educacion'
where t.slug in (
  'chatgpt-plus-edu',
  'gemini-advanced',
  'microsoft-copilot',
  'notion-ai',
  'github-copilot',
  'replit-ai',
  'perplexity-pro',
  'canva-ai',
  'figma-ai',
  'grammarly',
  'hemingway-editor',
  'wolfram-alpha',
  'photomath',
  'symbolab',
  'open-evidence'
)
on conflict (tool_id, career_path_id) do nothing;

insert into public.tool_careers (tool_id, career_path_id, sort_order)
select t.id, c.id, 1
from public.tools t
join public.career_paths c on c.slug = 'salud'
where t.slug in ('open-evidence', 'perplexity-pro', 'chatgpt-plus-edu', 'gemini-advanced', 'microsoft-copilot')
on conflict (tool_id, career_path_id) do nothing;

insert into public.tool_careers (tool_id, career_path_id, sort_order)
select t.id, c.id, 1
from public.tools t
join public.career_paths c on c.slug = 'negocios'
where t.slug in ('notion-ai', 'chatgpt-plus-edu', 'gemini-advanced', 'microsoft-copilot', 'canva-ai')
on conflict (tool_id, career_path_id) do nothing;

insert into public.tool_careers (tool_id, career_path_id, sort_order)
select t.id, c.id, 1
from public.tools t
join public.career_paths c on c.slug = 'derecho'
where t.slug in ('chatgpt-plus-edu', 'gemini-advanced', 'microsoft-copilot', 'notion-ai', 'perplexity-pro')
on conflict (tool_id, career_path_id) do nothing;

insert into public.tool_careers (tool_id, career_path_id, sort_order)
select t.id, c.id, 1
from public.tools t
join public.career_paths c on c.slug = 'matematicas'
where t.slug in ('wolfram-alpha', 'photomath', 'symbolab', 'chatgpt-plus-edu', 'gemini-advanced', 'microsoft-copilot')
on conflict (tool_id, career_path_id) do nothing;

insert into public.tool_careers (tool_id, career_path_id, sort_order)
select t.id, c.id, 1
from public.tools t
join public.career_paths c on c.slug = 'escritura'
where t.slug in ('grammarly', 'hemingway-editor', 'notion-ai', 'chatgpt-plus-edu', 'gemini-advanced', 'microsoft-copilot')
on conflict (tool_id, career_path_id) do nothing;
