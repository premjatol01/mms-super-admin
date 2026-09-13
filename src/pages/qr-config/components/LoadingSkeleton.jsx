export function SummaryCardsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-theme bg-surface p-4"
        >
          <div className="h-3 w-16 animate-pulse rounded bg-primary-light/40" />
          <div className="mt-3 h-6 w-12 animate-pulse rounded bg-primary-light/40" />
        </div>
      ))}
    </div>
  );
}

export function ConfigFormSkeleton() {
  return (
    <div className="space-y-4 rounded-xl border border-theme bg-surface p-5">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between border-b border-theme pb-4 last:border-0 last:pb-0"
        >
          <div className="space-y-2">
            <div className="h-4 w-32 animate-pulse rounded bg-primary-light/40" />
            <div className="h-3 w-56 animate-pulse rounded bg-primary-light/30" />
          </div>
          <div className="h-6 w-11 animate-pulse rounded-full bg-primary-light/40" />
        </div>
      ))}
    </div>
  );
}

export function TemplateGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-40 animate-pulse rounded-xl border border-theme bg-primary-light/20"
        />
      ))}
    </div>
  );
}
