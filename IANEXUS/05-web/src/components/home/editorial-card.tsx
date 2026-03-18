import Link from "next/link";
import type { ComponentType, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type IconType = ComponentType<{ className?: string }>;

type EditorialCardProps = {
  href: string;
  eyebrow: string;
  title: string;
  description: string;
  meta?: string;
  footer?: string;
  mediaUrl?: string | null;
  icon?: IconType;
  variant?: "compact" | "default" | "featured";
  className?: string;
  children?: ReactNode;
};

const cardVariants = {
  compact: "p-3",
  default: "p-3.5 md:p-4",
  featured: "p-4 md:p-4.5",
} as const;

const mediaHeights = {
  compact: "h-[4.5rem]",
  default: "h-24 md:h-[6.5rem]",
  featured: "h-32 md:h-36",
} as const;

export function EditorialCard({
  href,
  eyebrow,
  title,
  description,
  meta,
  footer,
  mediaUrl,
  icon: Icon,
  variant = "default",
  className,
  children,
}: EditorialCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_6px_16px_rgba(15,23,42,0.035)] transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_10px_20px_rgba(15,23,42,0.05)]",
        cardVariants[variant],
        className,
      )}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-sky-500 via-violet-500 to-emerald-500" />

      <div
        className={cn(
          "relative mb-3 overflow-hidden rounded-md border border-slate-200 bg-slate-100",
          mediaHeights[variant],
        )}
      >
        {mediaUrl ? (
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-[1.02]"
            style={{ backgroundImage: `url(${mediaUrl})` }}
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.95),_rgba(226,232,240,0.72)_45%,_rgba(241,245,249,0.9)_100%)]" />
        )}

        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/0 via-slate-950/0 to-slate-950/35" />

        {Icon ? (
          <div className="absolute left-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-md border border-white/30 bg-white/85 shadow-sm backdrop-blur">
            <Icon className="h-4 w-4 text-slate-800" />
          </div>
        ) : null}

        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-slate-950/55 to-transparent" />
      </div>

      <div className="relative z-10 flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <span className="inline-flex w-fit items-center rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-600">
            {eyebrow}
          </span>
          <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-slate-700" />
        </div>

        <h3 className="mt-2 text-[0.97rem] font-semibold leading-snug text-slate-950 md:text-[1.01rem]">
          {title}
        </h3>

        <p className="mt-1.5 text-[0.9rem] leading-6 text-slate-600">{description}</p>

        {children ? <div className="mt-4">{children}</div> : null}

        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          {meta ? <span className="text-xs font-medium text-slate-500">{meta}</span> : <span />}
          {footer ? (
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              {footer}
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}

