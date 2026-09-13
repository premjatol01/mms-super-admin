import { AlertTriangle, RotateCcw } from "lucide-react";

export default function ErrorState({
  title = "Unable to load features.",
  description = "Something went wrong while loading the feature configuration.",
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-theme bg-surface px-6 py-14 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 dark:bg-red-500/10">
        <AlertTriangle className="h-6 w-6 text-red-500" />
      </div>
      <div>
        <p className="font-medium text-theme">{title}</p>
        <p className="mt-1 text-sm text-secondary">{description}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-1 inline-flex items-center gap-2 rounded-lg border border-theme px-4 py-2 text-sm font-medium text-theme hover:bg-primary-light/20"
        >
          <RotateCcw className="h-4 w-4" />
          Retry
        </button>
      )}
    </div>
  );
}
