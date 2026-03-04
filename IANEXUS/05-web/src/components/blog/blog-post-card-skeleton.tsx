export function BlogPostCardSkeleton() {
  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5"
      style={{ minHeight: "220px" }}
    >
      {/* Header skeleton */}
      <div className="flex items-start justify-between gap-3">
        <div className="h-6 w-20 rounded-full bg-slate-50" />
        <div className="h-4 w-4 rounded-full bg-slate-50" />
      </div>

      {/* Title skeleton */}
      <div className="mt-4 space-y-2">
        <div className="h-6 w-full rounded bg-slate-50" />
        <div className="h-6 w-3/4 rounded bg-slate-50" />
      </div>

      {/* Excerpt skeleton */}
      <div className="mt-3 space-y-2">
        <div className="h-4 w-full rounded bg-slate-50" />
        <div className="h-4 w-5/6 rounded bg-slate-50" />
        <div className="h-4 w-4/6 rounded bg-slate-50" />
      </div>

      {/* Footer skeleton */}
      <div className="mt-auto pt-6">
        <div className="flex items-center justify-between border-t border-slate-200 pt-4">
          <div className="h-3 w-24 rounded bg-slate-50" />
          <div className="h-5 w-16 rounded-full bg-slate-50" />
        </div>
      </div>
    </div>
  );
}

