import { format } from 'date-fns';
import ModalShell from './ModalShell';
import StatusBadge from '../components/StatusBadge';
import { OFFER_TYPES } from '../data/offersData';

function Field({ label, children }) {
  return (
    <div>
      <p className="text-xs text-secondary">{label}</p>
      <div className="text-sm text-theme mt-0.5">{children}</div>
    </div>
  );
}

export default function OfferFeatureDetailsModal({ feature, onClose }) {
  if (!feature) return null;

  return (
    <ModalShell title={feature.name} onClose={onClose} maxWidth="max-w-lg">
      <div className="space-y-5">
        <section className="grid grid-cols-2 gap-4">
          <Field label="Feature Name">{feature.name}</Field>
          <Field label="Feature Key">
            <code className="text-xs bg-gray-100 rounded px-1.5 py-0.5">{feature.key}</code>
          </Field>
          <Field label="Category">{OFFER_TYPES[feature.type] ?? feature.type}</Field>
          <Field label="Status">
            <StatusBadge status={feature.status} size="sm" />
          </Field>
          <Field label="Last updated">{format(new Date(feature.updatedAt), 'MMM d, yyyy')}</Field>
          <Field label="Parent Module">Offers</Field>
        </section>

        <section>
          <p className="text-xs text-secondary">Description</p>
          <p className="text-sm text-theme mt-0.5">{feature.description}</p>
        </section>

        <section className="border-t border-theme pt-4">
          <p className="text-xs text-secondary mb-2">
            Used in {feature.packages.length} {feature.packages.length === 1 ? 'package' : 'packages'}
          </p>
          {feature.packages.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {feature.packages.map((pkg) => (
                <span key={pkg.id} className="text-xs rounded-full bg-surface border border-theme px-2.5 py-1 text-theme">
                  {pkg.name}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-secondary">Not included in any subscription package yet.</p>
          )}
        </section>
      </div>
    </ModalShell>
  );
}
