export function StatsSkeleton({ count = 5 }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl border border-theme bg-surface p-4">
          <div className="h-3 w-16 animate-pulse rounded bg-black/10" />
          <div className="mt-4 h-6 w-10 animate-pulse rounded bg-black/10" />
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="overflow-hidden rounded-xl border border-theme">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 border-b border-theme px-4 py-4 last:border-b-0"
        >
          <div className="h-4 w-1/4 animate-pulse rounded bg-black/10" />
          <div className="h-4 w-1/5 animate-pulse rounded bg-black/10" />
          <div className="h-4 w-16 animate-pulse rounded-full bg-black/10" />
          <div className="ml-auto h-4 w-20 animate-pulse rounded bg-black/10" />
        </div>
      ))}
    </div>
  );
}

export function CardGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="aspect-square animate-pulse rounded-xl bg-black/10" />
      ))}
    </div>
  );
}
