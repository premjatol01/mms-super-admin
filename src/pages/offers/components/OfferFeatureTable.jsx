import { format } from 'date-fns';
import { Eye, Pencil } from 'lucide-react';
import StatusBadge from './StatusBadge';
import ToggleSwitch from './ToggleSwitch';
import { OFFER_TYPES } from '../data/offersData';

export default function OfferFeatureTable({ features, onView, onEdit, onTogglePackageUsage, onToggleStatus }) {
  return (
    <div className="hidden md:block overflow-hidden rounded-xl border border-theme">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-surface text-left text-xs text-secondary border-b border-theme">
            <th className="px-4 py-3 font-medium">Offer Feature</th>
            <th className="px-4 py-3 font-medium">Type</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Used in Packages</th>
            <th className="px-4 py-3 font-medium">Updated</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {features.map((feature) => (
            <tr key={feature.id} className="border-b border-theme last:border-b-0 hover:bg-surface/60 transition-colors">
              <td className="px-4 py-3">
                <p className="font-medium text-theme">{feature.name}</p>
                <p className="text-xs text-secondary">{feature.key}</p>
              </td>
              <td className="px-4 py-3 text-theme">{OFFER_TYPES[feature.type] ?? feature.type}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <ToggleSwitch
                    size="sm"
                    checked={feature.status === 'Enabled'}
                    onChange={() => onToggleStatus(feature)}
                    label={`Toggle ${feature.name}`}
                  />
                  <StatusBadge status={feature.status} />
                </div>
              </td>
              <td className="px-4 py-3">
                <button
                  type="button"
                  onClick={() => onTogglePackageUsage(feature)}
                  className="text-theme underline decoration-dotted underline-offset-4 hover:decoration-solid"
                >
                  {feature.packages.length} {feature.packages.length === 1 ? 'Package' : 'Packages'}
                </button>
              </td>
              <td className="px-4 py-3 text-secondary">{format(new Date(feature.updatedAt), 'MMM d, yyyy')}</td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => onView(feature)}
                    aria-label={`View ${feature.name}`}
                    className="p-2 rounded-lg hover:bg-surface text-secondary hover:text-theme transition-colors"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onEdit(feature)}
                    aria-label={`Edit ${feature.name}`}
                    className="p-2 rounded-lg hover:bg-surface text-secondary hover:text-theme transition-colors"
                  >
                    <Pencil size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
