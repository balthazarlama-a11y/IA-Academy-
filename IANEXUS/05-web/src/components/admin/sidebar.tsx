"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Users,
  Wrench,
  BookOpenText,
  Settings,
  BookOpen,
  ArrowUpRight,
} from "lucide-react";
import type { AppRole } from "@/lib/auth/roles";

interface AdminSidebarProps {
  userRole: AppRole | null;
}

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Posts", href: "/admin/posts", icon: FileText },
  { name: "Tools", href: "/admin/tools", icon: Wrench },
  { name: "Relaciones", href: "/admin/relations", icon: BookOpenText },
  { name: "Usuarios", href: "/admin/users", icon: Users },
];

const masterOnlyNavigation = [
  { name: "Configuración", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar({ userRole }: AdminSidebarProps) {
  const pathname = usePathname();
  const isMaster = userRole === "master";

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="sticky top-0 flex h-screen w-[285px] flex-col border-r border-slate-200 bg-white/72 backdrop-blur-xl">
      <div className="border-b border-slate-200 px-6 py-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-[linear-gradient(135deg,rgba(59,130,246,0.18),rgba(139,92,246,0.18))] text-slate-900 shadow-[0_12px_24px_rgba(15,23,42,0.06)]">
            <BookOpen className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-slate-500">
              YourAI
            </p>
            <h2 className="mt-1 truncate text-lg font-semibold tracking-tight text-slate-950">
              Editorial desk
            </h2>
            <p className="text-xs text-slate-500">Admin panel · contenido y catálogo</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-4 py-5">
        <div>
          <p className="px-3 text-[11px] font-medium uppercase tracking-[0.2em] text-slate-400">
            Gestión
          </p>
          <div className="mt-3 space-y-1.5">
            {navigation.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group flex items-center gap-3 rounded-2xl border px-3 py-3 text-sm font-medium transition"
                  style={{
                    color: active ? "rgba(15,23,42,0.96)" : "rgba(51,65,85,0.82)",
                    background: active
                      ? "linear-gradient(135deg, rgba(59,130,246,0.14), rgba(139,92,246,0.10))"
                      : "rgba(255,255,255,0.70)",
                    borderColor: active ? "rgba(99,102,241,0.22)" : "rgba(226,232,240,0.9)",
                    boxShadow: active ? "0 10px 24px rgba(15,23,42,0.05)" : "none",
                  }}
                >
                  <item.icon className="h-4.5 w-4.5 flex-shrink-0" />
                  <span>{item.name}</span>
                  {active ? (
                    <span className="ml-auto inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-[10px] font-semibold text-slate-500 shadow-sm">
                      •
                    </span>
                  ) : (
                    <ArrowUpRight className="ml-auto h-4 w-4 text-slate-300 opacity-0 transition group-hover:opacity-100" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {isMaster ? (
          <div>
            <p className="px-3 text-[11px] font-medium uppercase tracking-[0.2em] text-slate-400">
              Master
            </p>
            <div className="mt-3 space-y-1.5">
              {masterOnlyNavigation.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="group flex items-center gap-3 rounded-2xl border px-3 py-3 text-sm font-medium transition"
                    style={{
                      color: active ? "rgba(15,23,42,0.96)" : "rgba(51,65,85,0.82)",
                      background: active
                        ? "linear-gradient(135deg, rgba(16,185,129,0.14), rgba(59,130,246,0.10))"
                        : "rgba(255,255,255,0.70)",
                      borderColor: active ? "rgba(16,185,129,0.22)" : "rgba(226,232,240,0.9)",
                      boxShadow: active ? "0 10px 24px rgba(15,23,42,0.05)" : "none",
                    }}
                  >
                    <item.icon className="h-4.5 w-4.5 flex-shrink-0" />
                    <span>{item.name}</span>
                    {active ? (
                      <span className="ml-auto inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-[10px] font-semibold text-slate-500 shadow-sm">
                        •
                      </span>
                    ) : (
                      <ArrowUpRight className="ml-auto h-4 w-4 text-slate-300 opacity-0 transition group-hover:opacity-100" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ) : null}
      </nav>

      <div className="border-t border-slate-200 p-4">
        <div className="rounded-[1.5rem] border border-slate-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,250,252,0.96))] p-4 shadow-[0_12px_28px_rgba(15,23,42,0.04)]">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500">
            Estado del desk
          </p>
          <p className="mt-2 text-sm font-medium text-slate-950">Contenido, catálogo y relaciones</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            Mantén el panel limpio: publica primero, etiqueta después.
          </p>
          <Link
            href="/"
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Volver al sitio
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
