/**
 * Sistema de roles para IA NEXUS Admin
 * Basado en el enum app_role de Supabase: master | admin | user
 */

export type AppRole = "master" | "admin" | "user";

export const ROLES = {
  MASTER: "master" as const,
  ADMIN: "admin" as const,
  USER: "user" as const,
};

/**
 * Verifica si un rol tiene acceso de administrador
 * Admin y Master pueden acceder al panel
 */
export function hasAdminAccess(role: string | null): boolean {
  if (!role) return false;
  return role === ROLES.ADMIN || role === ROLES.MASTER;
}

/**
 * Verifica si es master (super administrador)
 */
export function isMaster(role: string | null): boolean {
  return role === ROLES.MASTER;
}

/**
 * Jerarquía de roles para comparaciones
 */
const ROLE_HIERARCHY: Record<AppRole, number> = {
  user: 1,
  admin: 2,
  master: 3,
};

/**
 * Compara si el rol del usuario es igual o superior al requerido
 */
export function hasRoleLevel(
  userRole: string | null,
  requiredRole: AppRole
): boolean {
  if (!userRole) return false;
  const userLevel = ROLE_HIERARCHY[userRole as AppRole] || 0;
  const requiredLevel = ROLE_HIERARCHY[requiredRole] || 0;
  return userLevel >= requiredLevel;
}
