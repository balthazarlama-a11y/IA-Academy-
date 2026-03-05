-- IA NEXUS - Fix multiple_permissive_policies warnings
-- Objetivo:
-- 1) Evitar solapamiento SELECT entre *_select_unified y *_staff_modify
-- 2) Evitar solapamiento UPDATE en profiles (own + staff)
-- Estrategia:
-- - Reemplazar policies staff "FOR ALL" por policies separadas de INSERT/UPDATE/DELETE
-- - Mantener una sola policy SELECT por tabla
-- - Unificar profiles UPDATE en una sola policy (own OR staff)

-- -----------------------------------------------------------------------------
-- POSTS
-- -----------------------------------------------------------------------------
drop policy if exists posts_staff_all on public.posts;
drop policy if exists posts_staff_modify on public.posts;

create policy posts_staff_insert
on public.posts
for insert
to authenticated
with check (public.current_app_role() in ('admin', 'master'));

create policy posts_staff_update
on public.posts
for update
to authenticated
using (public.current_app_role() in ('admin', 'master'))
with check (public.current_app_role() in ('admin', 'master'));

create policy posts_staff_delete
on public.posts
for delete
to authenticated
using (public.current_app_role() in ('admin', 'master'));

-- -----------------------------------------------------------------------------
-- TOOLS
-- -----------------------------------------------------------------------------
drop policy if exists tools_staff_all on public.tools;
drop policy if exists tools_staff_modify on public.tools;

create policy tools_staff_insert
on public.tools
for insert
to authenticated
with check (public.current_app_role() in ('admin', 'master'));

create policy tools_staff_update
on public.tools
for update
to authenticated
using (public.current_app_role() in ('admin', 'master'))
with check (public.current_app_role() in ('admin', 'master'));

create policy tools_staff_delete
on public.tools
for delete
to authenticated
using (public.current_app_role() in ('admin', 'master'));

-- -----------------------------------------------------------------------------
-- TOOL CATEGORIES
-- -----------------------------------------------------------------------------
drop policy if exists tool_categories_staff_write on public.tool_categories;
drop policy if exists tool_categories_staff_modify on public.tool_categories;

create policy tool_categories_staff_insert
on public.tool_categories
for insert
to authenticated
with check (public.current_app_role() in ('admin', 'master'));

create policy tool_categories_staff_update
on public.tool_categories
for update
to authenticated
using (public.current_app_role() in ('admin', 'master'))
with check (public.current_app_role() in ('admin', 'master'));

create policy tool_categories_staff_delete
on public.tool_categories
for delete
to authenticated
using (public.current_app_role() in ('admin', 'master'));

-- -----------------------------------------------------------------------------
-- POST_TOOLS
-- -----------------------------------------------------------------------------
drop policy if exists post_tools_staff_all on public.post_tools;
drop policy if exists post_tools_staff_modify on public.post_tools;

create policy post_tools_staff_insert
on public.post_tools
for insert
to authenticated
with check (public.current_app_role() in ('admin', 'master'));

create policy post_tools_staff_update
on public.post_tools
for update
to authenticated
using (public.current_app_role() in ('admin', 'master'))
with check (public.current_app_role() in ('admin', 'master'));

create policy post_tools_staff_delete
on public.post_tools
for delete
to authenticated
using (public.current_app_role() in ('admin', 'master'));

-- -----------------------------------------------------------------------------
-- PROFILES (UPDATE)
-- -----------------------------------------------------------------------------
drop policy if exists profiles_update_own on public.profiles;
drop policy if exists profiles_master_update_all on public.profiles;

create policy profiles_update_own_or_staff
on public.profiles
for update
to authenticated
using (
  id = (select auth.uid())
  or public.current_app_role() in ('admin', 'master')
)
with check (
  id = (select auth.uid())
  or public.current_app_role() in ('admin', 'master')
);

