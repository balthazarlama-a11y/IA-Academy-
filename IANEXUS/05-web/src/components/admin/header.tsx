"use client";

import Image from "next/image";
import { Shield, User } from "lucide-react";
import { useRouter } from "next/navigation";
import type { UserSession } from "@/lib/auth/session";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

interface AdminHeaderProps {
  user: UserSession | null;
}

export function AdminHeader({ user }: AdminHeaderProps) {
  const router = useRouter();

  const role = user?.role ?? null;

  const roleBadge =
    role === "master" ? (
      <span
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
        style={{
          background:
            "linear-gradient(135deg, rgba(239, 68, 68, 0.20), rgba(249, 115, 22, 0.20))",
          color: "rgba(251, 146, 60, 0.90)",
          border: "1px solid rgba(251, 146, 60, 0.30)",
        }}
      >
        <Shield className="h-3 w-3" />
        Master
      </span>
    ) : role === "admin" ? (
      <span
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
        style={{
          background:
            "linear-gradient(135deg, rgba(59, 130, 246, 0.20), rgba(139, 92, 246, 0.20))",
          color: "rgba(147, 197, 253, 0.90)",
          border: "1px solid rgba(147, 197, 253, 0.30)",
        }}
      >
        Admin
      </span>
    ) : null;

  return (
    <header
      className="sticky top-0 z-40 px-6 py-4"
      style={{
        borderBottom: "1px solid rgba(148, 163, 184, 0.30)",
        background: "rgba(255, 255, 255, 0.86)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">Panel de Administración</h1>
          <p className="text-sm text-slate-500">Gestiona contenido, usuarios y configuración</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={async () => {
              const supabase = getSupabaseBrowserClient();
              await supabase.auth.signOut();
              router.replace("/");
              router.refresh();
            }}
            className="px-3 py-2 rounded-lg text-xs text-slate-700 border border-slate-200 hover:bg-white transition-colors"
            style={{ background: "rgba(248,250,252,0.9)" }}
          >
            Cerrar sesión
          </button>

          <div
            className="flex items-center gap-3 px-4 py-2 rounded-xl"
            style={{
              background: "rgba(248, 250, 252, 0.92)",
              border: "1px solid rgba(148, 163, 184, 0.25)",
            }}
          >
            <div
              className="relative h-9 w-9 rounded-full flex items-center justify-center overflow-hidden"
              style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}
            >
              {user?.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt={user.fullName || user.email || "Usuario"}
                  fill
                  unoptimized
                  sizes="36px"
                  className="rounded-full object-cover"
                />
              ) : (
                <User className="h-4 w-4 text-white" />
              )}
            </div>

            <div className="hidden md:block">
              <p className="text-sm font-medium text-slate-900">
                {user?.fullName || user?.email?.split("@")[0] || "Administrador"}
              </p>
              <p className="text-xs text-slate-500">{user?.email || "Sin email"}</p>
            </div>

            <div className="hidden sm:block">{roleBadge}</div>
          </div>
        </div>
      </div>
    </header>
  );
}

