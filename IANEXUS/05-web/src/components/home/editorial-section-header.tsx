import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type EditorialSectionHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  href?: string;
  cta?: string;
  className?: string;
};

export function EditorialSectionHeader({
  eyebrow,
  title,
  description,
  href,
  cta,
  className,
}: EditorialSectionHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-3 md:flex-row md:items-end md:justify-between", className)}>
      <div className="max-w-2xl">
        <p className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
          {eyebrow}
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
          {title}
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600 md:text-base">
          {description}
        </p>
      </div>

      {href && cta ? (
        <Link
          href={href}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
        >
          {cta}
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      ) : null}
    </div>
  );
}

