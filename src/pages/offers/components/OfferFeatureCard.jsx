import { Eye, Pencil } from 'lucide-react';
import StatusBadge from './StatusBadge';
import ToggleSwitch from './ToggleSwitch';
import { OFFER_TYPES } from '../data/offersData';

export default function OfferFeatureCard({ feature, onView, onEdit, onTogglePackageUsage, onToggleStatus }) {
  return (
    <div className="rounded-xl border border-theme bg-surface p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium text-theme">{feature.name}</p>
          <p className="text-xs text-secondary">{OFFER_TYPES[feature.type] ?? feature.type}</p>
        </div>
        <div className="flex items-center gap-2">
          <ToggleSwitch
            size="sm"
            checked={feature.status === 'Enabled'}
            onChange={() => onToggleStatus(feature)}
            label={`Toggle ${feature.name}`}
          />
          <StatusBadge status={feature.status} />
        </div>
      </div>

      <button
        type="button"
        onClick={() => onTogglePackageUsage(feature)}
        className="text-sm text-theme underline decoration-dotted underline-offset-4"
      >
        Used in {feature.packages.length} {feature.packages.length === 1 ? 'package' : 'packages'}
      </button>

      <div className="flex items-center gap-2 pt-1">
        <button
          type="button"
          onClick={() => onView(feature)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-theme py-2 text-sm font-medium text-theme"
        >
          <Eye size={14} /> View
        </button>
        <button
          type="button"
          onClick={() => onEdit(feature)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-theme py-2 text-sm font-medium text-theme"
        >
          <Pencil size={14} /> Edit
        </button>
      </div>
    </div>
  );
}
