import { Info } from 'lucide-react';
import ToggleSwitch from './ToggleSwitch';

export default function OfferModuleControl({ enabled, onToggle }) {
  return (
    <div className="rounded-xl border border-theme bg-surface p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-theme">Offer Module</p>
          <p className="text-xs text-secondary mt-0.5">
            Status: <span className="font-medium text-theme">{enabled ? 'Enabled' : 'Disabled'}</span>
          </p>
        </div>

        <ToggleSwitch checked={enabled} onChange={onToggle} label="Toggle Offer Module" />
      </div>

      {!enabled && (
        <div className="mt-4 flex items-start gap-2 rounded-lg bg-primary-light/60 border border-rose-200 px-3 py-2 text-xs text-rose-900">
          <Info size={14} className="mt-0.5 shrink-0" />
          <p>Enable the Offer Module to make individual offer types available.</p>
        </div>
      )}
    </div>
  );
}
