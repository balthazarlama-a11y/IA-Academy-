-- Verify careers taxonomy

select
  'career_paths' as table_name,
  count(*) as total_rows
from public.career_paths
union all
select
  'tool_careers' as table_name,
  count(*) as total_rows
from public.tool_careers;

select
  slug,
  name,
  sort_order,
  status
from public.career_paths
order by sort_order, name;

select
  cp.slug as career_slug,
  cp.name as career_name,
  count(tc.tool_id) as tool_count
from public.career_paths cp
left join public.tool_careers tc on tc.career_path_id = cp.id
left join public.tools t on t.id = tc.tool_id and t.status = 'published'
group by cp.slug, cp.name, cp.sort_order
order by cp.sort_order, cp.name;

select
  t.slug,
  t.name,
  count(tc.career_path_id) as career_links
from public.tools t
left join public.tool_careers tc on tc.tool_id = t.id
group by t.slug, t.name
order by career_links desc, t.name;

select
  t.slug as tool_slug,
  t.name as tool_name
from public.tools t
left join public.tool_careers tc on tc.tool_id = t.id
where tc.tool_id is null
order by t.name;

select
  schemaname,
  tablename,
  policyname,
  cmd,
  permissive
from pg_policies
where schemaname = 'public'
  and tablename in ('career_paths', 'tool_careers')
order by tablename, cmd, policyname;
