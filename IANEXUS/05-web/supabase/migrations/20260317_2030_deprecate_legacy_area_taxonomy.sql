-- IA NEXUS - Deprecate legacy area taxonomy in favor of careers
--
-- Canonical model:
-- - public.career_paths
-- - public.tool_careers
--
-- Legacy compatibility kept intentionally:
-- - public.tool_categories
-- - public.tools.category_id
--
-- This migration does not drop the legacy schema because the frontend and admin
-- still depend on it in production. The goal is to make the deprecation explicit
-- and provide a canonical query surface for the careers-based taxonomy.

comment on table public.tool_categories is
  'DEPRECATED: legacy area taxonomy. Keep only for backward compatibility while the UI migrates to career_paths/tool_careers.';

comment on column public.tools.category_id is
  'DEPRECATED: legacy category link. Use public.tool_careers and public.career_paths as the canonical taxonomy.';

drop view if exists public.tool_career_catalog;
create view public.tool_career_catalog as
select
  t.id as tool_id,
  t.slug as tool_slug,
  t.name as tool_name,
  t.status as tool_status,
  cp.id as career_path_id,
  cp.slug as career_slug,
  cp.name as career_name,
  cp.description as career_description,
  cp.icon_name as career_icon_name,
  cp.color_accent as career_color_accent,
  cp.sort_order as career_sort_order,
  tc.sort_order as tool_career_sort_order,
  tc.created_at as linked_at
from public.tool_careers tc
join public.tools t on t.id = tc.tool_id
join public.career_paths cp on cp.id = tc.career_path_id;

comment on view public.tool_career_catalog is
  'Canonical read surface for tools grouped by career. Prefer this over legacy category joins.';

