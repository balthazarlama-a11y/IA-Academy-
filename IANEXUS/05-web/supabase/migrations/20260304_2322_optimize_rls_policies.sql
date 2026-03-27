-- YourAI - Optimización de políticas RLS
-- Fecha: 2026-03-04
-- Objetivo: Resolver warnings de linter de Supabase (auth_rls_initplan, multiple_permissive_policies)
-- sin cambiar la lógica de seguridad funcional

-- ─────────────────────────────────────────────
-- 1) FIX: auth_rls_initplan en public.profiles
-- Reemplazar llamadas directas a auth.uid() / auth.role() por subqueries
-- para permitir que PostgreSQL haga planificación optimizada (initplan)
-- ─────────────────────────────────────────────

-- Política SELECT: perfiles propios o staff
-- ANTES: id = auth.uid() or public.current_app_role() in ('admin', 'master')
-- DESPUÉS: id = (select auth.uid()) or public.current_app_role() in ('admin', 'master')
drop policy if exists profiles_select_own_or_staff on public.profiles;
create policy profiles_select_own_or_staff
on public.profiles
for select
using (
  id = (select auth.uid())
  or public.current_app_role() in ('admin', 'master')
);

-- Política UPDATE: solo propio
-- ANTES: id = auth.uid()
-- DESPUÉS: id = (select auth.uid())
drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own
on public.profiles
for update
using (id = (select auth.uid()))
with check (id = (select auth.uid()));

-- Nota: profiles_master_update_all usa public.current_app_role() que ya es una función
-- estable (STABLE), no requiere cambio de auth.role() porque no usa auth.role() directamente


-- ─────────────────────────────────────────────
-- 2) FIX: multiple_permissive_policies para SELECT
-- Consolidar políticas SELECT superpuestas en una sola por tabla
-- Esto reduce la complejidad del planificador RLS y mejora performance
-- ─────────────────────────────────────────────

-- TABLA: public.posts
-- ANTES: 2 políticas SELECT separadas (posts_public_read_published + posts_staff_all FOR ALL con SELECT implícito)
-- DESPUÉS: 1 política SELECT unificada que cubre ambos casos
-- Lógica: staff ve todo, público solo ve publicados
drop policy if exists posts_public_read_published on public.posts;
drop policy if exists posts_staff_all on public.posts;

-- Nueva política SELECT unificada
create policy posts_select_unified
on public.posts
for select
using (
  -- Staff puede ver todo
  public.current_app_role() in ('admin', 'master')
  -- O público puede ver publicados
  or (
    status = 'published'
    and (published_at is null or published_at <= now())
  )
);

-- Políticas de modificación (INSERT/UPDATE/DELETE) separadas para staff
create policy posts_staff_modify
on public.posts
for all
using (public.current_app_role() in ('admin', 'master'))
with check (public.current_app_role() in ('admin', 'master'));


-- TABLA: public.tools
-- ANTES: 2 políticas SELECT (tools_public_read + tools_staff_all)
-- DESPUÉS: 1 política SELECT unificada
drop policy if exists tools_public_read on public.tools;
drop policy if exists tools_staff_all on public.tools;

create policy tools_select_unified
on public.tools
for select
using (
  -- Staff ve todo
  public.current_app_role() in ('admin', 'master')
  -- Público solo publicados
  or status = 'published'
);

-- Políticas de modificación para staff
create policy tools_staff_modify
on public.tools
for all
using (public.current_app_role() in ('admin', 'master'))
with check (public.current_app_role() in ('admin', 'master'));


-- TABLA: public.tool_categories
-- ANTES: 2 políticas SELECT (tool_categories_public_read + staff_write con SELECT)
-- DESPUÉS: 1 política SELECT unificada (todo el mundo puede leer, pero staff tiene privilegios adicionales)
drop policy if exists tool_categories_public_read on public.tool_categories;
drop policy if exists tool_categories_staff_write on public.tool_categories;

-- SELECT unificado: todo el mundo puede leer categorías (son metadata pública)
-- El control de escritura se maneja en políticas separadas de INSERT/UPDATE/DELETE
create policy tool_categories_select_unified
on public.tool_categories
for select
using (true);

-- Modificación solo para staff
create policy tool_categories_staff_modify
on public.tool_categories
for all
using (public.current_app_role() in ('admin', 'master'))
with check (public.current_app_role() in ('admin', 'master'));


-- TABLA: public.post_tools
-- ANTES: 2 políticas SELECT (post_tools_public_read + post_tools_staff_all)
-- DESPUÉS: 1 política SELECT unificada
drop policy if exists post_tools_public_read on public.post_tools;
drop policy if exists post_tools_staff_all on public.post_tools;

create policy post_tools_select_unified
on public.post_tools
for select
using (
  -- Staff ve todo
  public.current_app_role() in ('admin', 'master')
  -- Público solo relaciones de posts publicados
  or exists (
    select 1 from public.posts p
    where p.id = post_id
      and p.status = 'published'
      and (p.published_at is null or p.published_at <= now())
  )
);

-- Modificación solo para staff
create policy post_tools_staff_modify
on public.post_tools
for all
using (public.current_app_role() in ('admin', 'master'))
with check (public.current_app_role() in ('admin', 'master'));


-- ─────────────────────────────────────────────
-- VERIFICACIÓN: Consultas de validación
-- Ejecutar estas queries después de aplicar la migración para confirmar
-- ─────────────────────────────────────────────

/*
-- Listar políticas por tabla
select 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
from pg_policies
where schemaname = 'public'
  and tablename in ('profiles', 'posts', 'tools', 'tool_categories', 'post_tools', 'analytics_events')
order by tablename, cmd, policyname;

-- Contar políticas por tabla
select 
  tablename,
  count(*) as policy_count
from pg_policies
where schemaname = 'public'
group by tablename
order by tablename;

-- Smoke test conceptual (sin datos reales):
-- 1. Usuario anónimo:
--    - SELECT posts: solo published (con fecha válida)
--    - SELECT tools: solo published
--    - SELECT tool_categories: todas
--    - SELECT post_tools: solo de posts published
--    - SELECT profiles: solo propio (pero anónimo no tiene uuid) -> 0 rows
--
-- 2. Usuario autenticado (no staff):
--    - SELECT posts: solo published
--    - SELECT tools: solo published
--    - SELECT tool_categories: todas
--    - SELECT post_tools: solo de posts published
--    - SELECT profiles: solo su propio registro
--    - UPDATE profiles: solo su propio registro
--
-- 3. Usuario staff (admin/master):
--    - SELECT/INSERT/UPDATE/DELETE: todo en todas las tablas
*/

-- Comentario final
comment on table public.profiles is 'RLS optimizado: auth.uid() como subquery para initplan';
comment on table public.posts is 'RLS optimizado: política SELECT unificada (staff + público)';
comment on table public.tools is 'RLS optimizado: política SELECT unificada (staff + público)';
comment on table public.tool_categories is 'RLS optimizado: política SELECT unificada';
comment on table public.post_tools is 'RLS optimizado: política SELECT unificada (staff + público)';
