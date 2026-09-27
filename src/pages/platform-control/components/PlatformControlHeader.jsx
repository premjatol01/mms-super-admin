import { Pencil } from 'lucide-react';

export default function PlatformControlHeader({ editing, onEdit }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-xl border border-theme bg-surface p-4 sm:p-5">
      <div>
        <h1 className="text-xl font-bold text-theme">Platform Control</h1>
        <p className="text-sm text-secondary mt-1">Manage global platform settings and maintenance mode.</p>
      </div>

      {!editing && (
        <button
          type="button"
          onClick={onEdit}
          className="mt-4 sm:mt-0 inline-flex items-center gap-2 rounded-lg border border-theme px-4 py-2 text-sm font-medium text-theme hover:bg-gray-50 transition-colors shrink-0"
        >
          <Pencil size={16} />
          Edit Settings
        </button>
      )}
    </div>
  );
}
