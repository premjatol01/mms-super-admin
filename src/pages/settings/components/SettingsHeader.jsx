import PlatformStatusBadge from './PlatformStatusBadge';

export default function SettingsHeader({ platformStatus = 'Active' }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-xl border border-theme bg-surface p-4 sm:p-5">
      <div>
        <h1 className="text-xl font-bold text-theme">Platform Settings</h1>
        <p className="text-sm text-secondary mt-1">Manage global platform configuration, branding, and maintenance mode.</p>
      </div>

      <div className="mt-4 sm:mt-0 flex items-center gap-2 shrink-0">
        <span className="text-xs text-secondary font-medium">Status:</span>
        <PlatformStatusBadge status={platformStatus} />
      </div>
    </div>
  );
}
