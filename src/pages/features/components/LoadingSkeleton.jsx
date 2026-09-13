export function SummaryCardsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-theme bg-surface p-4">
          <div className="h-3 w-20 animate-pulse rounded bg-primary-light/40" />
          <div className="mt-3 h-6 w-10 animate-pulse rounded bg-primary-light/40" />
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-theme">
      <div className="h-10 bg-primary-light/10" />
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 border-t border-theme bg-surface px-4 py-4"
        >
          <div className="h-4 w-40 animate-pulse rounded bg-primary-light/30" />
          <div className="h-4 w-20 animate-pulse rounded bg-primary-light/30" />
          <div className="h-4 w-16 animate-pulse rounded bg-primary-light/30" />
          <div className="ml-auto h-4 w-24 animate-pulse rounded bg-primary-light/30" />
        </div>
      ))}
    </div>
  );
}
