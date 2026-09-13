import { Layers, SearchX } from "lucide-react";

export default function EmptyState({ variant = "empty", onAddFeature }) {
  if (variant === "no-results") {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-theme bg-surface px-6 py-14 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-light/40">
          <SearchX className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="font-medium text-theme">No features found</p>
          <p className="mt-1 text-sm text-secondary">
            Try changing your search or filters.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-theme bg-surface px-6 py-14 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-light/40">
        <Layers className="h-6 w-6 text-primary" />
      </div>
      <div>
        <p className="font-medium text-theme">No Features Available</p>
        <p className="mt-1 text-sm text-secondary">
          Create your first platform feature to make it available for
          subscription packages.
        </p>
      </div>
      {onAddFeature && (
        <button
          onClick={onAddFeature}
          className="mt-1 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          + Add Feature
        </button>
      )}
    </div>
  );
}
