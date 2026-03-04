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
  Shield,
  BookOpen,
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
    <aside
      className="w-64 flex-shrink-0 flex flex-col sticky top-0 h-screen"
      style={{
        borderRight: "1px solid rgba(148, 163, 184, 0.30)",
        background: "rgba(255, 255, 255, 0.72)",
      }}
    >
      {/* Logo */}
      <div className="p-6 border-b border-slate-200">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex-shrink-0">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <span className="text-base font-semibold tracking-tight text-slate-900">
              IA NEXUS
            </span>
            <p className="text-xs text-slate-500">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <p className="px-3 py-2 text-xs font-medium text-slate-400 uppercase tracking-wider">
          General
        </p>
        {navigation.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
              style={{
                color: active ? "rgba(15, 23, 42, 0.95)" : "rgba(51, 65, 85, 0.82)",
                background: active
                  ? "linear-gradient(135deg, rgba(59, 130, 246, 0.14), rgba(124, 58, 237, 0.12))"
                  : "transparent",
                border: active ? "1px solid rgba(99, 102, 241, 0.30)" : "1px solid transparent",
              }}
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              {item.name}
              {active && (
                <span
                  className="ml-auto w-1.5 h-1.5 rounded-full"
                  style={{
                    background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                  }}
                />
              )}
            </Link>
          );
        })}

        {/* Master Only Section */}
        {isMaster && (
          <>
            <p className="px-3 py-2 mt-6 text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Shield className="h-3 w-3" />
              Master
            </p>
            {masterOnlyNavigation.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
                  style={{
                    color: active ? "rgba(15, 23, 42, 0.95)" : "rgba(51, 65, 85, 0.82)",
                    background: active
                      ? "linear-gradient(135deg, rgba(59, 130, 246, 0.14), rgba(124, 58, 237, 0.12))"
                      : "transparent",
                    border: active ? "1px solid rgba(99, 102, 241, 0.30)" : "1px solid transparent",
                  }}
                >
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  {item.name}
                </Link>
              );
            })}
          </>
        )}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-500 hover:text-slate-700 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
            <path
              d="M2 7h10M7 2l-5 5 5 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Volver al sitio
        </Link>
      </div>
    </aside>
  );
}

