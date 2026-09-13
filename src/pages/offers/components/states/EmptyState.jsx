import { PackageOpen } from 'lucide-react';

export default function EmptyState({ onConfigure }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4 border border-dashed border-theme rounded-xl">
      <div className="rounded-full bg-surface p-3 mb-4">
        <PackageOpen size={22} className="text-secondary" />
      </div>
      <p className="font-medium text-theme">No offer features found</p>
      <p className="text-sm text-secondary mt-1 max-w-sm">
        Offer functionality has not been configured yet.
      </p>
      {onConfigure && (
        <button
          type="button"
          onClick={onConfigure}
          className="mt-4 rounded-lg bg-teal-600 text-white text-sm font-medium px-4 py-2 hover:bg-teal-700 transition-colors"
        >
          Configure offers
        </button>
      )}
    </div>
  );
}
