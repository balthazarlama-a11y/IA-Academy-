"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

interface StaffEditButtonProps {
  href: string;
  label: string;
  /** Extra positioning classes, e.g. "absolute right-3 top-3 z-10" */
  className?: string;
}

// Module-level cache: undefined = not checked yet, null = checked, not staff
let _cachedIsStaff: boolean | undefined = undefined;

function getCached(): boolean {
  return _cachedIsStaff === true;
}

/**
 * Renders a pencil-icon link only when the current browser session
 * belongs to an admin or master user. Caches the role check at module
 * level so tab switches / remounts are instant (no flash).
 */
export function StaffEditButton({ href, label, className }: StaffEditButtonProps) {
  const [show, setShow] = useState(getCached);

  useEffect(() => {
    // Already resolved — no need to re-query
    if (_cachedIsStaff !== undefined) {
      setShow(_cachedIsStaff);
      return;
    }

    const supabase = getSupabaseBrowserClient();

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) {
        _cachedIsStaff = false;
        return;
      }

      supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single()
        .then(({ data }) => {
          const isStaff = data?.role === "admin" || data?.role === "master";
          _cachedIsStaff = isStaff;
          if (isStaff) setShow(true);
        });
    });
  }, []);

  if (!show) return null;

  return (
    <Link
      href={href}
      aria-label={label}
      className={[
        "flex h-7 w-7 items-center justify-center rounded-full",
        "border border-slate-300 bg-white/90 text-slate-500 shadow-sm",
        "hover:bg-slate-100 hover:text-slate-700 transition-colors",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <path
          d="M8.5 1.5l2 2L4 10H2V8L8.5 1.5z"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  );
}
