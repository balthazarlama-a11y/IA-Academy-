-- YourAI - Security Fixes
-- Fecha: 2026-03-04
-- Objetivo: Resolver warnings de seguridad del linter de Supabase
-- - function_search_path_mutable
-- - rls_policy_always_true (analytics_events_insert)
-- Sin romper tracking ni KPIs existentes

-- ─────────────────────────────────────────────
-- 1) FIX: function_search_path_mutable
-- Fijar search_path en funciones para prevenir hijacking de objetos
-- ─────────────────────────────────────────────

-- Función set_updated_at (usada por triggers de updated_at)
-- ANTES: search_path mutable (riesgo de que busque en schemas incorrectos)
-- DESPUÉS: search_path fijo a public, pg_temp
ALTER FUNCTION public.set_updated_at() SET search_path = public, pg_temp;

-- Función get_whatsapp_clicks_by_location (KPI dashboard)
-- ANTES: search_path mutable
-- DESPUÉS: search_path fijo
ALTER FUNCTION public.get_whatsapp_clicks_by_location(integer) SET search_path = public, pg_temp;

-- Función get_whatsapp_top_pages (KPI dashboard)
-- ANTES: search_path mutable
-- DESPUÉS: search_path fijo
ALTER FUNCTION public.get_whatsapp_top_pages(integer, integer) SET search_path = public, pg_temp;

-- Nota: current_app_role() ya tiene SET search_path = public explícito en su definición original
-- pero por si acaso lo reafirmamos (es idempotente)
ALTER FUNCTION public.current_app_role() SET search_path = public, pg_temp;


-- ─────────────────────────────────────────────
-- 2) FIX: rls_policy_always_true
-- Endurecer política INSERT de analytics_events
-- Reemplazar WITH CHECK (true) por validaciones mínimas de seguridad
-- ─────────────────────────────────────────────

-- Eventos permitidos (whitelist) para evitar inyección de eventos arbitrarios
-- Solo estos eventos son aceptados por el sistema de tracking
DROP POLICY IF EXISTS analytics_events_insert ON public.analytics_events;
CREATE POLICY analytics_events_insert
  ON public.analytics_events FOR INSERT
  WITH CHECK (
    -- Solo eventos conocidos del sistema
    event_name IN (
      'click_whatsapp_cta',
      'click_join_community',
      'view_tool',
      'copy_prompt'
    )
    -- Longitudes máximas para prevenir spam/abuso
    AND length(coalesce(location, '')) <= 80
    AND length(coalesce(page_path, '')) <= 300
    AND length(coalesce(session_id, '')) <= 120
  );

-- Nota: La política de SELECT para staff no cambia (ya es restrictiva)
-- Solo staff puede leer analytics: current_app_role() in ('admin', 'master')


-- ─────────────────────────────────────────────
-- 3) VERIFICACIÓN
-- Queries para confirmar los cambios aplicados
-- ─────────────────────────────────────────────

/*
-- Verificar search_path fijado en funciones
SELECT 
  p.proname as function_name,
  p.proconfig as settings,
  CASE 
    WHEN p.proconfig @> ARRAY['search_path=public, pg_temp'] THEN '✅ Fijado'
    ELSE '⚠️ Mutable (default)'
  END as status
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
  AND p.proname IN (
    'set_updated_at',
    'get_whatsapp_clicks_by_location',
    'get_whatsapp_top_pages',
    'current_app_role'
  );

-- Verificar política de analytics_events
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public' 
  AND tablename = 'analytics_events';

-- Verificar que el dashboard KPI sigue funcionando
-- (Debe retornar datos sin error si hay eventos registrados)
SELECT * FROM public.get_whatsapp_clicks_by_location(7);
SELECT * FROM public.get_whatsapp_top_pages(7, 5);
*/


-- ─────────────────────────────────────────────
-- COMENTARIOS DE DOCUMENTACIÓN
-- ─────────────────────────────────────────────

COMMENT ON FUNCTION public.set_updated_at() IS 
  'Trigger function para auto-actualizar updated_at. Search_path fijado a public, pg_temp por seguridad.';

COMMENT ON FUNCTION public.get_whatsapp_clicks_by_location(integer) IS 
  'KPI: Clicks de WhatsApp por location. Search_path fijado. Security definer para acceso staff.';

COMMENT ON FUNCTION public.get_whatsapp_top_pages(integer, integer) IS 
  'KPI: Top páginas que envían tráfico a WhatsApp. Search_path fijado. Security definer para acceso staff.';

COMMENT ON POLICY analytics_events_insert ON public.analytics_events IS 
  'INSERT solo para eventos whitelisteados. Previene inyección de eventos arbitrarios.';
