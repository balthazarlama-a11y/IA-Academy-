"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  LogIn,
  LogOut,
  PenSquare,
  Shield,
  Wrench,
  X,
} from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { AppRole } from "@/lib/auth/roles";

type HeaderSession = {
  id: string;
  email: string | null;
  fullName: string | null;
  role: AppRole;
};

type CachedHeaderSession = {
  expiresAt: number;
  value: HeaderSession | null;
};

const HEADER_SESSION_CACHE_KEY = "ianexus:header-session:v1";
const HEADER_CACHE_TTL_MS = 120_000;
const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/estudiantes", label: "Gratis para estudiantes" },
  { href: "/areas", label: "Áreas" },
  { href: "/dia-a-dia", label: "Día a Día" },
  { href: "/blog", label: "Blog" },
] as const;

function readCachedHeaderSession() {
  if (typeof window === "undefined") return undefined;

  try {
    const raw = window.sessionStorage.getItem(HEADER_SESSION_CACHE_KEY);
    if (!raw) return undefined;

    const parsed = JSON.parse(raw) as CachedHeaderSession;
    if (!parsed || typeof parsed.expiresAt !== "number") {
      window.sessionStorage.removeItem(HEADER_SESSION_CACHE_KEY);
      return undefined;
    }

    if (parsed.expiresAt <= Date.now()) {
      window.sessionStorage.removeItem(HEADER_SESSION_CACHE_KEY);
      return undefined;
    }

    return parsed.value;
  } catch {
    return undefined;
  }
}

function writeCachedHeaderSession(value: HeaderSession | null) {
  if (typeof window === "undefined") return;

  const payload: CachedHeaderSession = {
    value,
    expiresAt: Date.now() + HEADER_CACHE_TTL_MS,
  };

  try {
    window.sessionStorage.setItem(HEADER_SESSION_CACHE_KEY, JSON.stringify(payload));
  } catch {
    // Keep auth UI resilient if storage is unavailable.
  }
}

function HeaderBadge({
  children,
  tone = "slate",
}: {
  children: React.ReactNode;
  tone?: "slate" | "blue" | "emerald" | "violet";
}) {
  const tones = {
    slate: "border-slate-300 bg-white/75 text-slate-700",
    blue: "border-blue-200 bg-blue-50 text-blue-700",
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
    violet: "border-violet-200 bg-violet-50 text-violet-700",
  } as const;

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-medium tracking-wide ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);

  const [session, setSession] = useState<HeaderSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const requestIdRef = useRef(0);

  useEffect(() => {
    let active = true;

    async function hydrateSession(preferCache: boolean) {
      const requestId = ++requestIdRef.current;

      if (preferCache) {
        const cachedValue = readCachedHeaderSession();
        if (cachedValue !== undefined) {
          setSession(cachedValue);
          setIsLoading(false);
          if (cachedValue) return;
        }
      }

      const {
        data: { session: authSession },
      } = await supabase.auth.getSession();

      if (!active) return;
      if (requestId !== requestIdRef.current) return;

      const user = authSession?.user;
      if (!user) {
        setSession(null);
        setIsLoading(false);
        writeCachedHeaderSession(null);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, role")
        .eq("id", user.id)
        .maybeSingle();

      if (!active) return;
      if (requestId !== requestIdRef.current) return;

      const nextSession: HeaderSession = {
        id: user.id,
        email: user.email ?? null,
        fullName: (profile?.full_name as string | null) ?? null,
        role: ((profile?.role as AppRole | null) ?? "user"),
      };

      setSession(nextSession);
      setIsLoading(false);
      writeCachedHeaderSession(nextSession);
    }

    void hydrateSession(true);

    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        setSession(null);
        setIsLoading(false);
        writeCachedHeaderSession(null);
        return;
      }
      if (event === "SIGNED_IN" || event === "USER_UPDATED") {
        void hydrateSession(false);
      }
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, [supabase]);

  const nextPath = pathname || "/";
  const loginHref = `/login?next=${encodeURIComponent(nextPath)}`;
  const isStaff = session?.role === "admin" || session?.role === "master";
  const displayName =
    session?.fullName?.trim() || session?.email?.split("@")[0] || "Usuario";

  return (
    <header className="relative z-50 px-4 pt-3">
      <div className="relative mx-auto w-full max-w-5xl">
        <div className="relative overflow-hidden rounded-xl border border-slate-200/80 bg-white/88 shadow-[0_10px_28px_rgba(15,23,42,0.06)] backdrop-blur-md editorial-surface">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(255,255,255,0.84))]" />
          <div className="relative z-10 px-4 py-3 md:px-5">
            <div className="flex items-center justify-between gap-3">
              <Link
                href="/"
                className="flex min-w-0 items-center gap-3 flex-none"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-900 text-white shadow-sm">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-[0.92rem] font-semibold tracking-tight text-slate-900">
                    IA NEXUS
                  </span>
                  <span className="hidden text-[11px] text-slate-500 md:block">
                    Curación editorial de IA
                  </span>
                </div>
              </Link>

              <nav className="hidden items-center gap-1 rounded-full border border-slate-200 bg-slate-50/80 px-1.5 py-1 md:flex">
                {NAV_LINKS.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/" && pathname.startsWith(item.href + "/"));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`rounded-full px-3 py-2 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-white text-slate-950 shadow-sm"
                          : "text-slate-600 hover:bg-white/75 hover:text-slate-900"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="hidden items-center gap-2 md:flex">
                {isLoading ? (
                  <div className="h-9 w-28 rounded-full bg-slate-200 animate-pulse" />
                ) : !session ? (
                  <Link
                    href={loginHref}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 transition-colors hover:bg-slate-50"
                  >
                    <LogIn className="h-4 w-4" />
                    Iniciar sesión
                  </Link>
                ) : (
                  <>
                    <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 lg:flex">
                      {isStaff ? <Shield className="h-3.5 w-3.5 text-blue-700" /> : null}
                      <div className="flex flex-col leading-tight">
                        <span className="text-[11px] font-medium text-slate-500">
                          Sesión activa
                        </span>
                        <span className="text-sm text-slate-800">{displayName}</span>
                      </div>
                    </div>

                    {isStaff ? (
                      <>
                        <Link
                          href="/admin/tools"
                          className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700 transition-colors hover:bg-emerald-100"
                          title="Añadir tool"
                        >
                          <Wrench className="h-3.5 w-3.5" />
                          <span className="hidden xl:inline">Añadir tool</span>
                        </Link>
                        <Link
                          href="/admin/posts"
                          className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3 py-2 text-xs font-medium text-violet-700 transition-colors hover:bg-violet-100"
                          title="Subir post"
                        >
                          <PenSquare className="h-3.5 w-3.5" />
                          <span className="hidden xl:inline">Subir post</span>
                        </Link>
                        <Link
                          href="/admin"
                          className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-100"
                        >
                          Admin
                        </Link>
                      </>
                    ) : null}

                    <button
                      type="button"
                      onClick={async () => {
                        await supabase.auth.signOut();
                        setSession(null);
                        writeCachedHeaderSession(null);
                        router.refresh();
                      }}
                      className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Salir
                    </button>
                  </>
                )}
              </div>

              <div className="md:hidden">
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen((v) => !v)}
                  aria-label={mobileMenuOpen ? "Cerrar menu" : "Abrir menu"}
                  aria-expanded={mobileMenuOpen}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700 shadow-sm"
                >
                  {mobileMenuOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path
                        d="M4 7h16M4 12h16M4 17h16"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {mobileMenuOpen ? (
          <div className="mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white/96 shadow-[0_14px_32px_rgba(15,23,42,0.1)] backdrop-blur-md md:hidden">
            <nav className="grid grid-cols-2 gap-2 p-2">
              {NAV_LINKS.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href + "/"));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`min-h-11 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-slate-900 text-white"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-slate-200 p-3">
              {isLoading ? (
                <div className="h-9 w-28 rounded-full bg-slate-200 animate-pulse" />
              ) : !session ? (
                <Link
                  href={loginHref}
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800"
                >
                  <LogIn className="h-4 w-4" />
                  Iniciar sesión
                </Link>
              ) : (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
                    <div className="min-w-0">
                      <div className="text-[11px] font-medium uppercase tracking-widest text-slate-500">
                        {isStaff ? "Editor" : "Cuenta"}
                      </div>
                      <div className="truncate text-sm text-slate-800">{displayName}</div>
                    </div>
                    <HeaderBadge tone={isStaff ? "blue" : "slate"}>
                      {isStaff ? "Staff" : "Activo"}
                    </HeaderBadge>
                  </div>

                  {isStaff ? (
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href="/admin/tools"
                        onClick={() => setMobileMenuOpen(false)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm font-medium text-emerald-700"
                      >
                        <Wrench className="h-4 w-4" />
                        Tool
                      </Link>
                      <Link
                        href="/admin/posts"
                        onClick={() => setMobileMenuOpen(false)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-3 py-2.5 text-sm font-medium text-violet-700"
                      >
                        <PenSquare className="h-4 w-4" />
                        Post
                      </Link>
                      <Link
                        href="/admin"
                        onClick={() => setMobileMenuOpen(false)}
                        className="col-span-2 inline-flex items-center justify-center rounded-xl border border-blue-200 bg-blue-50 px-3 py-2.5 text-sm font-medium text-blue-700"
                      >
                        Admin
                      </Link>
                    </div>
                  ) : null}

                  <button
                    type="button"
                    onClick={async () => {
                      await supabase.auth.signOut();
                      setSession(null);
                      writeCachedHeaderSession(null);
                      setMobileMenuOpen(false);
                      router.refresh();
                    }}
                    className="inline-flex items-center justify-center gap-1.5 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700"
                  >
                    <LogOut className="h-4 w-4" />
                    Salir
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
