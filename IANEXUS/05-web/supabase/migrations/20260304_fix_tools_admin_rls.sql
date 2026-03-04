-- Fix RLS policies for admin tools listing
-- Issue: staff users couldn't see non-published tools in admin panel

-- ─────────────────────────────────────────────
-- FIX: Tools RLS policies for staff SELECT access
-- ─────────────────────────────────────────────

-- Drop the problematic policy
DROP POLICY IF EXISTS tools_staff_all ON public.tools;

-- Create separate policies for better control:

-- 1. Staff can SELECT all tools (including drafts) for admin panel
DROP POLICY IF EXISTS tools_staff_select ON public.tools;
CREATE POLICY tools_staff_select
  ON public.tools FOR SELECT
  USING (public.current_app_role() IN ('admin', 'master'));

-- 2. Staff can INSERT new tools
DROP POLICY IF EXISTS tools_staff_insert ON public.tools;
CREATE POLICY tools_staff_insert
  ON public.tools FOR INSERT
  WITH CHECK (public.current_app_role() IN ('admin', 'master'));

-- 3. Staff can UPDATE tools
DROP POLICY IF EXISTS tools_staff_update ON public.tools;
CREATE POLICY tools_staff_update
  ON public.tools FOR UPDATE
  USING (public.current_app_role() IN ('admin', 'master'))
  WITH CHECK (public.current_app_role() IN ('admin', 'master'));

-- 4. Staff can DELETE tools
DROP POLICY IF EXISTS tools_staff_delete ON public.tools;
CREATE POLICY tools_staff_delete
  ON public.tools FOR DELETE
  USING (public.current_app_role() IN ('admin', 'master'));

-- Note: tools_public_read remains for anonymous/public access to published tools
-- The policies are OR'd together, so:
-- - Public sees only published tools (via tools_public_read)
-- - Staff sees ALL tools (via tools_staff_select) + can modify them
