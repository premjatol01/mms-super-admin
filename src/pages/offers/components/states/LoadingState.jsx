function Shimmer({ className = '' }) {
  return <div className={`animate-pulse bg-gray-200/70 rounded-lg ${className}`} />;
}

export default function LoadingState() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading offer configuration">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Shimmer key={i} className="h-16" />
        ))}
      </div>

      <Shimmer className="h-20" />

      <div className="space-y-2">
        <Shimmer className="h-10" />
        <Shimmer className="h-14" />
        <Shimmer className="h-14" />
        <Shimmer className="h-14" />
      </div>
    </div>
  );
}
