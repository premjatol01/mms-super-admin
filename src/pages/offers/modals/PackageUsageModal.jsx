import { Package } from 'lucide-react';
import ModalShell from './ModalShell';

export default function PackageUsageModal({ feature, onClose }) {
  if (!feature) return null;

  return (
    <ModalShell title="Packages using this feature" onClose={onClose} maxWidth="max-w-sm">
      <p className="text-xs text-secondary mb-3">{feature.name}</p>

      {feature.packages.length > 0 ? (
        <ul className="space-y-2">
          {feature.packages.map((pkg) => (
            <li
              key={pkg.id}
              className="flex items-center gap-2.5 rounded-lg border border-theme px-3 py-2 text-sm text-theme"
            >
              <Package size={15} className="text-secondary" />
              {pkg.name}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-secondary">Not included in any subscription package yet.</p>
      )}
    </ModalShell>
  );
}
