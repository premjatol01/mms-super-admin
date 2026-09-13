import { Pencil } from 'lucide-react';

export default function PlatformControlHeader({ editing, onEdit }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-theme">Platform Control</h1>
        <p className="mt-1 text-sm text-secondary max-w-xl">Manage global platform configuration.</p>
      </div>

      {!editing && (
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-2 rounded-lg border border-theme px-3 py-2 text-sm font-medium text-theme hover:bg-surface transition-colors shrink-0"
        >
          <Pencil size={16} />
          Edit
        </button>
      )}
    </div>
  );
}
