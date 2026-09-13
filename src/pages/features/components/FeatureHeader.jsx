import { Layers, Plus } from "lucide-react";

export default function FeatureHeader({ onAddFeature }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-light/40">
          <Layers className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-theme">Features</h1>
          <p className="mt-0.5 text-sm text-secondary">
            Manage platform features available to subscription packages.
          </p>
        </div>
      </div>
      <button
        onClick={onAddFeature}
        className="inline-flex shrink-0 items-center gap-2 self-start rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90"
      >
        <Plus className="h-4 w-4" />
        Add Feature
      </button>
    </div>
  );
}
