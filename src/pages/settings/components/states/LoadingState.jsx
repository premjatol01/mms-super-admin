function Shimmer({ className = '' }) {
  return <div className={`animate-pulse bg-gray-200/70 rounded-lg ${className}`} />;
}

export default function LoadingState() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading platform configuration">
      <Shimmer className="h-40" />
      <Shimmer className="h-48" />
      <Shimmer className="h-28" />
      <Shimmer className="h-36" />
    </div>
  );
}
