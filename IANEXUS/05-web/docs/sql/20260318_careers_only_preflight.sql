-- Preflight for 20260318_0300_careers_only_schema_cutover.sql
--
-- Run this before applying the destructive cutover.
-- The cutover is safe only if every section below returns the expected result.

-- 1. Every tool must have at least one career mapping.
select
  t.id,
  t.slug,
  t.name
from public.tools t
left join public.tool_careers tc on tc.tool_id = t.id
where tc.tool_id is null
order by t.slug;

-- 2. Legacy category links should not be relied on by the app anymore.
select count(*) as tools_with_legacy_category
from public.tools
where category_id is not null;

-- 3. No orphaned rows in the canonical join table.
select
  count(*) filter (where t.id is null) as missing_tool_rows,
  count(*) filter (where cp.id is null) as missing_career_rows
from public.tool_careers tc
left join public.tools t on t.id = tc.tool_id
left join public.career_paths cp on cp.id = tc.career_path_id;

-- 4. No duplicate tool/career links.
select
  tool_id,
  career_path_id,
  count(*) as duplicate_count
from public.tool_careers
group by tool_id, career_path_id
having count(*) > 1;

-- 5. Optional editorial relation audit.
select count(*) as post_tool_links
from public.post_tools;

-- 6. Redundant image column audit.
select
  count(*) filter (where logo_url is not null) as logo_url_filled,
  count(*) filter (where cover_image_url is not null) as cover_image_url_filled,
  count(*) filter (where logo_url is not null and cover_image_url is not null) as both_filled
from public.tools;

-- 7. Informational snapshot of the taxonomy after cutover.
select
  (select count(*) from public.tools) as tools_count,
  (select count(*) from public.career_paths) as careers_count,
  (select count(*) from public.tool_careers) as tool_career_links,
  (select count(*) from public.posts) as posts_count,
  (select count(*) from public.post_tools) as post_tool_links;
