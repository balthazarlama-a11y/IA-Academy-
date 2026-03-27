-- YourAI - Sanity Check: Tools Schema (Fase 2)
-- Ejecutar en Supabase SQL Editor para verificar integridad del schema y seed.
-- Esperado: todas las queries retornan datos correctos sin errores.

-- ─────────────────────────────────────────────
-- 1. VERIFICAR TABLAS EXISTEN
-- ─────────────────────────────────────────────

select table_name, table_type
from information_schema.tables
where table_schema = 'public'
  and table_name in ('tool_categories', 'tools', 'post_tools')
order by table_name;
-- Esperado: 3 filas

-- ─────────────────────────────────────────────
-- 2. VERIFICAR ENUMS EXISTEN
-- ─────────────────────────────────────────────

select typname, array_agg(enumlabel order by enumsortorder) as values
from pg_type t
join pg_enum e on e.enumtypid = t.oid
where typname in ('tool_plan', 'tool_level')
group by typname;
-- Esperado: 2 filas
-- tool_plan  → {free, freemium, paid, edu_free}
-- tool_level → {beginner, intermediate, advanced, all}

-- ─────────────────────────────────────────────
-- 3. VERIFICAR COLUMNAS DE tools
-- ─────────────────────────────────────────────

select column_name, data_type, is_nullable
from information_schema.columns
where table_schema = 'public'
  and table_name = 'tools'
order by ordinal_position;
-- Esperado: id, name, slug, description, url, logo_url, plan, level,
--           ia_type, category_id, verified, edu_verified, featured,
--           status, sort_order, created_at, updated_at

-- ─────────────────────────────────────────────
-- 4. VERIFICAR ÍNDICES
-- ─────────────────────────────────────────────

select indexname, tablename, indexdef
from pg_indexes
where schemaname = 'public'
  and tablename in ('tool_categories', 'tools', 'post_tools')
order by tablename, indexname;
-- Esperado: al menos 9 índices entre las 3 tablas

-- ─────────────────────────────────────────────
-- 5. VERIFICAR CATEGORÍAS SEED
-- ─────────────────────────────────────────────

select id, name, slug, color_accent, icon_name, sort_order
from public.tool_categories
order by sort_order;
-- Esperado: 7 filas en orden:
-- 0-todas, 1-programacion, 2-investigacion, 3-diseno,
-- 4-matematicas, 5-salud, 6-escritura

-- ─────────────────────────────────────────────
-- 6. VERIFICAR TOTAL DE TOOLS
-- ─────────────────────────────────────────────

select count(*) as total_tools
from public.tools;
-- Esperado: 22

-- ─────────────────────────────────────────────
-- 7. VERIFICAR TOOLS POR CATEGORÍA
-- ─────────────────────────────────────────────

select
  tc.name         as categoria,
  tc.slug,
  count(t.id)     as num_tools
from public.tool_categories tc
left join public.tools t on t.category_id = tc.id
group by tc.id, tc.name, tc.slug
order by tc.sort_order;
-- Esperado:
-- todas         → 4
-- programacion  → 5
-- investigacion → 5
-- diseno        → 3
-- matematicas   → 3
-- salud         → 1
-- escritura     → 2 (total = 23 con ChatGPT siendo de "todas")

-- ─────────────────────────────────────────────
-- 8. VERIFICAR TOOLS EDU GRATUITAS
-- ─────────────────────────────────────────────

select name, slug, plan, edu_verified
from public.tools
where plan = 'edu_free'
order by name;
-- Esperado: ChatGPT Plus, Canva AI, Figma AI, GitHub Copilot,
--           Grammarly, Microsoft Copilot, Perplexity Pro, Replit AI (8 tools)

-- ─────────────────────────────────────────────
-- 9. VERIFICAR TOOLS FEATURED
-- ─────────────────────────────────────────────

select name, category_id, plan, featured
from public.tools
where featured = true
order by name;
-- Esperado: ChatGPT Plus, Canva AI, Cursor IDE, Gemini Advanced,
--           GitHub Copilot, OpenEvidence, Perplexity Pro, Wolfram Alpha (8 tools)

-- ─────────────────────────────────────────────
-- 10. VERIFICAR TRIGGERS EN tools
-- ─────────────────────────────────────────────

select trigger_name, event_manipulation, event_object_table
from information_schema.triggers
where trigger_schema = 'public'
  and event_object_table in ('tool_categories', 'tools')
order by event_object_table, trigger_name;
-- Esperado: trg_tool_categories_updated_at (UPDATE), trg_tools_updated_at (UPDATE)

-- ─────────────────────────────────────────────
-- 11. VERIFICAR RLS ACTIVO
-- ─────────────────────────────────────────────

select tablename, rowsecurity
from pg_tables
where schemaname = 'public'
  and tablename in ('tool_categories', 'tools', 'post_tools');
-- Esperado: las 3 tablas con rowsecurity = true

-- ─────────────────────────────────────────────
-- 12. VERIFICAR POLICIES
-- ─────────────────────────────────────────────

select policyname, tablename, cmd, qual
from pg_policies
where schemaname = 'public'
  and tablename in ('tool_categories', 'tools', 'post_tools')
order by tablename, policyname;
-- Esperado: 6 policies (2 por tabla)

-- ─────────────────────────────────────────────
-- 13. SIMULACIÓN QUERY PÚBLICA (sin auth)
-- Reproduje lo que haría el frontend anon
-- ─────────────────────────────────────────────

select
  t.id,
  t.name,
  t.slug,
  t.description,
  t.url,
  t.plan,
  t.level,
  t.ia_type,
  t.featured,
  t.edu_verified,
  tc.name    as category_name,
  tc.color_accent,
  tc.icon_name
from public.tools t
join public.tool_categories tc on tc.id = t.category_id
where t.status = 'published'
order by tc.sort_order, t.sort_order
limit 25;
-- Esperado: 22 filas con join correcto a categorías

-- ─────────────────────────────────────────────
-- 14. VERIFICAR CONSTRAINT: tools SIN categoría válida
-- (debe ser 0 — integridad referencial)
-- ─────────────────────────────────────────────

select count(*) as tools_sin_categoria
from public.tools t
left join public.tool_categories tc on tc.id = t.category_id
where tc.id is null;
-- Esperado: 0

-- ─────────────────────────────────────────────
-- 15. TEST: trigger updated_at funciona
-- ─────────────────────────────────────────────

-- Nota: ejecutar en transacción para no modificar datos permanentemente
begin;
  update public.tools
  set description = description
  where slug = 'github-copilot';

  select slug, updated_at
  from public.tools
  where slug = 'github-copilot';
  -- Esperado: updated_at = now() (timestamp actual)
rollback;
