"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";

type WorkspaceStats = {
  label: string;
  value: string | number;
};

export function PostEditorWorkspace({
  eyebrow,
  title,
  description,
  backHref = "/admin/posts",
  backLabel = "Volver al archivo",
  stats = [],
  sidebar,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  backHref?: string;
  backLabel?: string;
  stats?: WorkspaceStats[];
  sidebar: ReactNode;
  children: ReactNode;
}) {
  const [showGuide, setShowGuide] = useState(false);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.10),transparent_25%),linear-gradient(180deg,#f6f7fb_0%,#eef2f7_100%)] text-slate-950">
      <div className="mx-auto flex min-h-screen max-w-[1760px] flex-col px-3 py-4 md:px-5 md:py-5">
        <header className="sticky top-0 z-20 border border-slate-200/80 bg-white/88 px-4 py-3 shadow-[0_14px_34px_rgba(15,23,42,0.05)] backdrop-blur md:px-6 rounded-[1.8rem]">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={backHref}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  <span aria-hidden="true">←</span>
                  {backLabel}
                </Link>
                <span className="inline-flex rounded-full border border-[#3351c8]/15 bg-[#3351c8]/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#3351c8]">
                  {eyebrow}
                </span>
                {stats.map((stat) => (
                  <span
                    key={stat.label}
                    className="hidden rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500 xl:inline-flex"
                  >
                    {stat.label}: {stat.value}
                  </span>
                ))}
              </div>

              <h1 className="mt-4 font-[var(--font-display)] text-[2.3rem] leading-none tracking-tight text-slate-950 md:text-[3.4rem]">
                {title}
              </h1>
              <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-600 md:text-[0.98rem]">
                {description}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowGuide((current) => !current)}
              className="inline-flex shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              {showGuide ? "Ocultar guia" : "Ver guia"}
            </button>
          </div>
        </header>

        <main className="mt-5 flex-1">{children}</main>
      </div>

      {showGuide ? (
        <div className="fixed inset-0 z-[100]">
          <button
            type="button"
            aria-label="Cerrar guia"
            onClick={() => setShowGuide(false)}
            className="absolute inset-0 bg-slate-950/18 backdrop-blur-[1px]"
          />
          <aside className="absolute right-0 top-0 h-full w-full max-w-[380px] overflow-auto border-l border-slate-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,249,252,0.98))] px-5 py-5 shadow-[-18px_0_42px_rgba(15,23,42,0.10)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#3351c8]">
                  Workspace guide
                </p>
                <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">
                  Soporte editorial
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50"
              >
                ×
              </button>
            </div>

            <div className="mt-6">{sidebar}</div>
          </aside>
        </div>
      ) : null}
    </div>
  );
}
