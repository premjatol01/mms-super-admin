import { Layers, Plus } from "lucide-react";

export default function FeatureHeader({ onAddFeature }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-end">
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
