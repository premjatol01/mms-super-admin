import { Eye, Pencil } from "lucide-react";
import FeatureStatusBadge from "./FeatureStatusBadge";
import FeatureCategoryBadge from "./FeatureCategoryBadge";

export default function FeatureCard({ feature, onView, onEdit }) {
  return (
    <div className="rounded-xl border border-theme bg-surface p-4 sm:hidden">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-medium text-theme">{feature.name}</p>
          <p className="text-xs text-secondary">{feature.key}</p>
        </div>
        <FeatureStatusBadge status={feature.status} />
      </div>

      <p className="mt-2 text-sm text-secondary">{feature.description}</p>

      <div className="mt-3 flex items-center justify-between">
        <FeatureCategoryBadge category={feature.category} />
        <span className="text-xs text-secondary">
          Used in: {feature.packages?.length || 0} packages
        </span>
      </div>

      <div className="mt-3 flex gap-2">
        <button
          onClick={() => onView(feature)}
          className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-theme py-1.5 text-xs font-medium text-theme"
        >
          <Eye className="h-3.5 w-3.5" /> View
        </button>
        <button
          onClick={() => onEdit(feature)}
          className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-theme py-1.5 text-xs font-medium text-theme"
        >
          <Pencil className="h-3.5 w-3.5" /> Edit
        </button>
      </div>
    </div>
  );
}
