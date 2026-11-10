import { AlertTriangle, Wrench } from 'lucide-react';
import SectionCard from './SectionCard';
import ToggleField from './ToggleField';
import TextField from './TextField';

export default function MaintenanceModeCard({ values, setValue, register, editing = true }) {
  const handleToggle = (next) => {
    setValue('maintenanceEnabled', next, { shouldDirty: true });
    setValue('platformStatus', next ? 'Maintenance' : 'Active', { shouldDirty: true });
  };

  return (
    <SectionCard
      title="Maintenance Mode"
      description="Temporarily make the platform unavailable to restaurants and customers while performing system upgrades."
    >
      <ToggleField
        label="Maintenance Mode"
        description="When enabled, public websites and customer order portals display your maintenance message instead of the platform."
        checked={Boolean(values.maintenanceEnabled)}
        onChange={handleToggle}
        editing={editing}
      />

      {values.maintenanceEnabled && (
        <div className="rounded-lg border border-amber-300/80 bg-amber-50 dark:bg-amber-950/30 p-3.5 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Maintenance Mode is Active</p>
            <p className="mt-0.5 text-amber-700 dark:text-amber-400">
              Visitors, restaurant websites, and customer QR ordering portals will see the custom maintenance screen below. Super Admin access remains unaffected.
            </p>
          </div>
        </div>
      )}

      <TextField
        id="maintenanceMessage"
        label="Maintenance Notice Message"
        textarea
        editing={editing}
        placeholder="e.g. We are currently performing scheduled maintenance to improve our systems. Tablly will be back shortly!"
        {...register('maintenanceMessage')}
      />
    </SectionCard>
  );
}
