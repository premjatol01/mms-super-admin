import { AlertTriangle, RotateCw } from "lucide-react";

export default function ErrorState({
  title = "Unable to load CMS content.",
  description = "Please try again.",
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-theme bg-surface px-6 py-14 text-center">
      <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-500">
        <AlertTriangle className="h-5 w-5" />
      </span>
      <p className="text-sm font-medium text-theme">{title}</p>
      <p className="mt-1 text-sm text-secondary">{description}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-2 rounded-lg border border-theme px-4 py-2 text-sm font-medium text-theme hover:bg-black/[0.03]"
        >
          <RotateCw className="h-3.5 w-3.5" />
          Retry
        </button>
      )}
    </div>
  );
}
