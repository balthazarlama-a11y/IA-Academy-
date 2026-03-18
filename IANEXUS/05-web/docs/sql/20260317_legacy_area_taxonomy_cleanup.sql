-- Phase 2 cleanup: remove legacy area taxonomy only after the frontend and admin
-- stop depending on `tool_categories` and `tools.category_id`.
--
-- Preconditions:
-- 1. No code path reads `tool_categories` directly.
-- 2. No code path filters `tools.category_id` directly.
-- 3. All tools are mapped through `career_paths` / `tool_careers`.
-- 4. The verification queries below return zero missing mappings.
--
-- Suggested execution order:
-- 1. Verify the app is fully on careers.
-- 2. Back up the database.
-- 3. Run the drops below.

-- Safety checks
select count(*) as tools_with_category from public.tools where category_id is not null;
select count(*) as tools_without_career_mapping
from public.tools t
left join public.tool_careers tc on tc.tool_id = t.id
where tc.tool_id is null;

-- Cleanup candidates (only execute once the preconditions are satisfied)
-- alter table public.tools drop column category_id;
-- drop table public.tool_categories cascade;
-- drop view if exists public.tool_career_catalog;

