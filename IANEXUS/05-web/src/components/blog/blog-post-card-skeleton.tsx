export function BlogPostCardSkeleton() {
  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-5"
      style={{ minHeight: "220px" }}
    >
      {/* Header skeleton */}
      <div className="flex items-start justify-between gap-3">
        <div className="h-6 w-20 rounded-full bg-white/10" />
        <div className="h-4 w-4 rounded-full bg-white/10" />
      </div>

      {/* Title skeleton */}
      <div className="mt-4 space-y-2">
        <div className="h-6 w-full rounded bg-white/10" />
        <div className="h-6 w-3/4 rounded bg-white/10" />
      </div>

      {/* Excerpt skeleton */}
      <div className="mt-3 space-y-2">
        <div className="h-4 w-full rounded bg-white/10" />
        <div className="h-4 w-5/6 rounded bg-white/10" />
        <div className="h-4 w-4/6 rounded bg-white/10" />
      </div>

      {/* Footer skeleton */}
      <div className="mt-auto pt-6">
        <div className="flex items-center justify-between border-t border-white/10 pt-4">
          <div className="h-3 w-24 rounded bg-white/10" />
          <div className="h-5 w-16 rounded-full bg-white/10" />
        </div>
      </div>
    </div>
  );
}
