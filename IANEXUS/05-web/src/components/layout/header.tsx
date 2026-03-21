"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  LogIn,
  LogOut,
  PenSquare,
  Search,
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
  { href: "/estudiantes", label: "Estudiantes" },
  { href: "/areas", label: "Carreras" },
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
    slate: "border-slate-300/80 bg-white/75 text-slate-700",
    blue: "border-blue-200/80 bg-[color:var(--accent-soft)] text-[#3351c8]",
    emerald: "border-emerald-200/80 bg-[#eef8f4] text-emerald-700",
    violet: "border-violet-200/80 bg-[#f3efff] text-violet-700",
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
  const searchHref = "/buscar";
  const isStaff = session?.role === "admin" || session?.role === "master";
  const displayName = session?.fullName?.trim() || session?.email?.split("@")[0] || "Usuario";
  const searchIsActive = pathname === "/buscar";

  return (
    <header className="relative z-50 w-full border-b border-[color:var(--line-muted)] bg-[rgba(246,242,234,0.92)] backdrop-blur-md">
      <div className="editorial-frame flex min-h-[104px] items-center gap-6 px-4 py-4 md:px-6 md:py-5">
        <Link href="/" className="min-w-0 flex-1">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200/80 bg-white/80 text-[#172033] shadow-sm">
              <BookOpen className="h-[18px] w-[18px]" />
            </div>
            <div className="min-w-0">
              <p className="editorial-kicker editorial-muted">IA NEXUS editorial desk</p>
              <div className="editorial-display mt-1 text-[2.05rem] leading-none font-semibold tracking-[-0.05em] text-[#111827] md:text-[2.7rem]">
                IA NEXUS
              </div>
              <p className="editorial-muted mt-2 text-xs leading-5 md:text-[0.86rem]">
                Herramientas, criterio y contexto para navegar la IA con un enfoque más serio y útil.
              </p>
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 xl:flex">
          {NAV_LINKS.map((item) => {
            const isActive =
              pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href + "/"));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`editorial-display nav-link text-[1.18rem] leading-none transition-colors ${
                  isActive ? "text-[#172033]" : "text-[#5a6478] hover:text-[#3351c8]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden shrink-0 items-center gap-2 md:flex">
          <Link
            href={searchHref}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors ${
              searchIsActive
                ? "border-[#172033] bg-[#172033] text-white"
                : "border-slate-300/80 bg-white/72 text-slate-700 hover:bg-white"
            }`}
          >
            <Search className="h-4 w-4" />
            Buscar
          </Link>

          {isLoading ? (
            <div className="h-11 w-28 rounded-full bg-slate-200 animate-pulse" />
          ) : !session ? (
            <Link
              href={loginHref}
              className="inline-flex items-center gap-2 rounded-full border border-slate-300/80 bg-white/72 px-4 py-2.5 text-sm font-medium text-slate-800 transition-colors hover:bg-white"
            >
              <LogIn className="h-4 w-4" />
              Iniciar sesión
            </Link>
          ) : (
            <>
              <div className="hidden items-center gap-2 rounded-full border border-slate-200/80 bg-white/72 px-4 py-2.5 lg:flex">
                {isStaff ? <Shield className="h-3.5 w-3.5 text-[#3351c8]" /> : null}
                <div className="flex flex-col leading-tight">
                  <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-slate-500">
                    Sesión activa
                  </span>
                  <span className="text-sm text-slate-800">{displayName}</span>
                </div>
              </div>

              {isStaff ? (
                <>
                  <Link
                    href="/admin/tools"
                    className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-[#eef8f4] px-3 py-2.5 text-sm font-medium text-emerald-700 transition-colors hover:brightness-95"
                    title="Añadir tool"
                  >
                    <Wrench className="h-3.5 w-3.5" />
                    Tool
                  </Link>
                  <Link
                    href="/admin/posts"
                    className="inline-flex items-center gap-1.5 rounded-full border border-violet-200/80 bg-[#f3efff] px-3 py-2.5 text-sm font-medium text-violet-700 transition-colors hover:brightness-95"
                    title="Subir post"
                  >
                    <PenSquare className="h-3.5 w-3.5" />
                    Post
                  </Link>
                  <Link
                    href="/admin"
                    className="inline-flex items-center rounded-full border border-blue-200/80 bg-[color:var(--accent-soft)] px-3 py-2.5 text-sm font-medium text-[#3351c8] transition-colors hover:brightness-95"
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
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-300/80 bg-white/72 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-white"
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
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300/80 bg-white/80 text-slate-700 shadow-sm"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>)}
          </button>
        </div>
      </div>

      {mobileMenuOpen ? (
        <div className="editorial-rule border-t bg-[rgba(246,242,234,0.96)] md:hidden">
          <div className="editorial-frame px-4 py-4">
            <div className="grid gap-2">
              <Link
                href={searchHref}
                onClick={() => setMobileMenuOpen(false)}
                className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-medium transition-colors ${
                  searchIsActive
                    ? "bg-[#172033] text-white"
                    : "border border-slate-300/80 bg-white/85 text-slate-700 hover:bg-white"
                }`}
              >
                <Search className="h-4 w-4" />
                Buscar herramientas
              </Link>

              {NAV_LINKS.map((item) => {
                const isActive =
                  pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href + "/"));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`rounded-[1.15rem] px-4 py-3 text-left transition-colors ${
                      isActive
                        ? "bg-[#172033] text-white"
                        : "border border-slate-200 bg-white/82 text-slate-700 hover:bg-white"
                    }`}
                  >
                    <span className="editorial-display text-[1.15rem] leading-none">{item.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="mt-4 border-t border-slate-200 pt-4">
              {isLoading ? (
                <div className="h-9 w-28 rounded-full bg-slate-200 animate-pulse" />
              ) : !session ? (
                <Link
                  href={loginHref}
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300/80 bg-white/82 px-4 py-2 text-sm font-medium text-slate-800"
                >
                  <LogIn className="h-4 w-4" />
                  Iniciar sesión
                </Link>
              ) : (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-3 rounded-[1.2rem] border border-slate-200 bg-white/82 px-3 py-3">
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
                        className="inline-flex items-center justify-center gap-2 rounded-[1.1rem] border border-emerald-200/80 bg-[#eef8f4] px-3 py-2.5 text-sm font-medium text-emerald-700"
                      >
                        <Wrench className="h-4 w-4" />
                        Tool
                      </Link>
                      <Link
                        href="/admin/posts"
                        onClick={() => setMobileMenuOpen(false)}
                        className="inline-flex items-center justify-center gap-2 rounded-[1.1rem] border border-violet-200/80 bg-[#f3efff] px-3 py-2.5 text-sm font-medium text-violet-700"
                      >
                        <PenSquare className="h-4 w-4" />
                        Post
                      </Link>
                      <Link
                        href="/admin"
                        onClick={() => setMobileMenuOpen(false)}
                        className="col-span-2 inline-flex items-center justify-center rounded-[1.1rem] border border-blue-200/80 bg-[color:var(--accent-soft)] px-3 py-2.5 text-sm font-medium text-[#3351c8]"
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
                    className="inline-flex items-center justify-center gap-1.5 rounded-full border border-slate-300/80 bg-white/82 px-4 py-2 text-sm font-medium text-slate-700"
                  >
                    <LogOut className="h-4 w-4" />
                    Salir
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
