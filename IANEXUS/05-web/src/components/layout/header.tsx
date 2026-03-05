"use client";

import Link from "next/link";
import { useMemo, useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { BookOpen, LogIn, LogOut, PenSquare, Shield, Wrench, X } from "lucide-react";
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
  { href: "/estudiantes", label: "Estudiantes" },
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
    // Ignore storage errors so auth UI never crashes.
  }
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
        <div
          className="relative overflow-hidden rounded-full"
          style={{
            border: "1px solid rgba(148, 163, 184, 0.35)",
            boxShadow:
              "0 12px 28px rgba(15,23,42,0.10), inset 0 1px 0 rgba(255,255,255,0.85)",
          }}
        >
          <div
            className="absolute inset-0 z-0 rounded-[inherit]"
            style={{
              backdropFilter: "blur(16px) saturate(140%)",
              isolation: "isolate",
              contain: "layout style paint",
            }}
          />
          <div
            className="absolute inset-0 z-10 rounded-[inherit]"
            style={{ background: "rgba(255, 255, 255, 0.82)" }}
          />
          <div
            className="absolute inset-0 z-20 rounded-[inherit]"
            style={{
              boxShadow:
                "inset 1px 1px 0 rgba(255,255,255,0.78), inset -1px -1px 0 rgba(148,163,184,0.20)",
            }}
          />

          <div className="relative z-30 flex items-center justify-between gap-3 px-4 py-3 md:px-5">
            <Link href="/" className="flex items-center gap-3 flex-none" onClick={() => setMobileMenuOpen(false)}>
              <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex-shrink-0">
                <BookOpen className="h-5 w-5" />
              </div>
              <span
                className="text-base font-semibold tracking-tight"
                style={{ color: "rgba(15,23,42,0.92)" }}
              >
                IA NEXUS
              </span>
            </Link>

            <nav className="hidden md:flex gap-8 items-center">
              {NAV_LINKS.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`nav-link text-sm font-medium transition-colors hover:opacity-100${isActive ? " active" : ""}`}
                    style={{ color: isActive ? "rgba(37,99,235,0.9)" : "rgba(51,65,85,0.82)" }}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="hidden md:flex items-center gap-2 flex-none">
              {isLoading ? (
                <div className="h-9 w-24 rounded-full bg-slate-200 animate-pulse" />
              ) : !session ? (
                <Link
                  href={loginHref}
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white transition-opacity duration-200 hover:opacity-90"
                  style={{
                    background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                    border: "1px solid rgba(99,102,241,0.30)",
                    touchAction: "manipulation",
                  }}
                >
                  <LogIn className="h-4 w-4" />
                  Login
                </Link>
              ) : (
                <>
                  <div
                    className="hidden lg:flex items-center gap-2 rounded-full px-3 py-1.5"
                    style={{
                      background: "rgba(241,245,249,0.92)",
                      border: "1px solid rgba(148,163,184,0.30)",
                    }}
                  >
                    {isStaff ? <Shield className="h-3.5 w-3.5 text-blue-700" /> : null}
                    <span className="text-xs text-slate-700">{displayName}</span>
                  </div>

                  {isStaff ? (
                    <>
                      <Link
                        href="/admin/tools"
                        className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold text-emerald-700 transition-opacity hover:opacity-90"
                        style={{
                          background: "rgba(16,185,129,0.14)",
                          border: "1px solid rgba(16,185,129,0.34)",
                          touchAction: "manipulation",
                        }}
                        title="Añadir Tool"
                      >
                        <Wrench className="h-3.5 w-3.5" />
                        <span className="hidden lg:inline">Añadir Tool</span>
                      </Link>
                      <Link
                        href="/admin/posts"
                        className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold text-violet-700 transition-opacity hover:opacity-90"
                        style={{
                          background: "rgba(124,58,237,0.14)",
                          border: "1px solid rgba(124,58,237,0.30)",
                          touchAction: "manipulation",
                        }}
                        title="Subir Post"
                      >
                        <PenSquare className="h-3.5 w-3.5" />
                        <span className="hidden lg:inline">Subir Post</span>
                      </Link>
                      <Link
                        href="/admin"
                        className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-xs font-semibold text-blue-700"
                        style={{
                          background: "rgba(37,99,235,0.14)",
                          border: "1px solid rgba(37,99,235,0.32)",
                        }}
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
                    className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-xs font-semibold text-slate-700"
                    style={{
                      background: "rgba(241,245,249,0.92)",
                      border: "1px solid rgba(148,163,184,0.30)",
                    }}
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Salir
                  </button>
                </>
              )}
            </div>

            <div className="md:hidden flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMobileMenuOpen((v) => !v)}
                aria-label={mobileMenuOpen ? "Cerrar menu" : "Abrir menu"}
                aria-expanded={mobileMenuOpen}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen ? (
          <div
            className="mt-2 rounded-2xl border border-slate-200 bg-white/95 p-3 backdrop-blur-xl md:hidden"
            style={{ boxShadow: "0 12px 30px rgba(15,23,42,0.12)" }}
          >
            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {isStaff ? (
              <div className="mt-2 flex flex-col gap-1 border-t border-slate-200 pt-2">
                <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                  Acciones rápidas
                </p>
                <Link
                  href="/admin/tools"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
                >
                  <Wrench className="h-4 w-4 text-emerald-600" />
                  Añadir Tool
                </Link>
                <Link
                  href="/admin/posts"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
                >
                  <PenSquare className="h-4 w-4 text-violet-700" />
                  Subir Post
                </Link>
              </div>
            ) : null}

            <div className="mt-3 border-t border-slate-200 pt-3">
              {isLoading ? (
                <div className="h-9 w-24 rounded-full bg-slate-200 animate-pulse" />
              ) : !session ? (
                <Link
                  href={loginHref}
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white"
                  style={{
                    background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                    border: "1px solid rgba(99,102,241,0.30)",
                  }}
                >
                  <LogIn className="h-4 w-4" />
                  Login
                </Link>
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm text-slate-700 truncate">{displayName}</div>
                  <div className="flex items-center gap-2">
                    {isStaff ? (
                      <Link
                        href="/admin"
                        onClick={() => setMobileMenuOpen(false)}
                        className="inline-flex items-center rounded-full px-3 py-2 text-xs font-semibold text-blue-700"
                        style={{
                          background: "rgba(37,99,235,0.14)",
                          border: "1px solid rgba(37,99,235,0.32)",
                        }}
                      >
                        Admin
                      </Link>
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
                      className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-xs font-semibold text-slate-700"
                      style={{
                        background: "rgba(241,245,249,0.92)",
                        border: "1px solid rgba(148,163,184,0.30)",
                      }}
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Salir
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
