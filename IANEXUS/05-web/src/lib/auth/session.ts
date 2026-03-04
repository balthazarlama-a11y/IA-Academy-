/**
 * Helpers de sesión para autenticación con Supabase
 */

import { getSupabaseServerAuthClient } from "@/lib/supabase/server";
import type { AppRole } from "./roles";

export type UserSession = {
  id: string;
  email: string | null;
  role: AppRole | null;
  fullName: string | null;
  avatarUrl: string | null;
};

/**
 * Obtiene la sesión actual del usuario desde Supabase
 * Versión server-side (para Server Components y Server Actions)
 */
export async function getCurrentUser(): Promise<UserSession | null> {
  try {
    const supabase = await getSupabaseServerAuthClient();

    // Obtener usuario autenticado
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return null;
    }

    // Obtener perfil con rol desde la tabla profiles
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role, full_name, avatar_url")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      console.error("Error fetching profile:", profileError);
    }

    return {
      id: user.id,
      email: user.email ?? null,
      role: (profile?.role as AppRole) || "user",
      fullName: profile?.full_name ?? null,
      avatarUrl: profile?.avatar_url ?? null,
    };
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

/**
 * Verifica si el usuario actual tiene acceso de admin
 */
export async function checkAdminAccess(): Promise<{
  user: UserSession | null;
  hasAccess: boolean;
}> {
  const user = await getCurrentUser();

  if (!user) {
    return { user: null, hasAccess: false };
  }

  const hasAccess = user.role === "admin" || user.role === "master";

  return { user, hasAccess };
}
