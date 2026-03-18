-- IA NEXUS - careers-only schema cutover
--
-- Target canonical schema:
-- - public.profiles
-- - public.posts
-- - public.tools
-- - public.career_paths
-- - public.tool_careers
-- - public.post_tools (kept for editorial linking)
--
-- Legacy objects removed by this cutover:
-- - public.tool_categories
-- - public.tools.category_id
-- - public.tools.logo_url
-- - public.tool_career_catalog
--
-- IMPORTANT:
-- This migration is intentionally not applied automatically to the live project yet.
-- It must run only after the app cutover is merged and the preflight script passes.

begin;

-- Safety gate: every tool must already be mapped to at least one career.
do $$
begin
  if exists (
    select 1
    from public.tools t
    left join public.tool_careers tc on tc.tool_id = t.id
    where tc.tool_id is null
  ) then
    raise exception 'careers-only cutover aborted: at least one tool has no career mapping';
  end if;
end
$$;

-- Preserve any useful image data before dropping the redundant column.
update public.tools
set cover_image_url = coalesce(cover_image_url, logo_url)
where logo_url is not null;

-- Ensure the canonical join table has the indexes needed by the app.
create index if not exists idx_tool_careers_career_path_sort
  on public.tool_careers (career_path_id, sort_order, tool_id);

create index if not exists idx_tool_careers_tool_sort
  on public.tool_careers (tool_id, sort_order, career_path_id);

-- The compatibility view is no longer needed once the cutover lands.
drop view if exists public.tool_career_catalog;

-- Drop legacy category link from tools first, then remove the legacy table.
alter table public.tools
  drop constraint if exists tools_category_id_fkey;

alter table public.tools
  drop column if exists category_id;

alter table public.tools
  drop column if exists logo_url;

drop table if exists public.tool_categories;

comment on table public.tools is
  'Canonical tools catalog for IA NEXUS. Career taxonomy is modeled through public.tool_careers.';

comment on table public.career_paths is
  'Canonical careers taxonomy used by the public catalog, admin, and discovery surfaces.';

comment on table public.tool_careers is
  'Canonical many-to-many relation between tools and careers.';

comment on column public.tools.cover_image_url is
  'Primary visual asset for the tool card and detail pages.';

commit;
