import { RefreshCw, ListChecks } from 'lucide-react';

export default function OffersHeader({ onRefresh, onViewFeatureUsage, isRefreshing }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-theme">Offers</h1>
        <p className="mt-1 text-sm text-secondary max-w-xl">
          Manage offer-related functionality available through restaurant subscriptions.
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onViewFeatureUsage}
          className="inline-flex items-center gap-2 rounded-lg border border-theme px-3 py-2 text-sm font-medium text-theme hover:bg-surface transition-colors"
        >
          <ListChecks size={16} />
          Feature usage
        </button>
        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center gap-2 rounded-lg border border-theme px-3 py-2 text-sm font-medium text-theme hover:bg-surface transition-colors disabled:opacity-60"
        >
          <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>
    </div>
  );
}
