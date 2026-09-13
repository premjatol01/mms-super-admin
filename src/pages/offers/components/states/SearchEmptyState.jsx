import { SearchX } from 'lucide-react';

export default function SearchEmptyState({ onClearFilters }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4 border border-dashed border-theme rounded-xl">
      <div className="rounded-full bg-surface p-3 mb-4">
        <SearchX size={22} className="text-secondary" />
      </div>
      <p className="font-medium text-theme">No matching offer features found</p>
      <p className="text-sm text-secondary mt-1">Try changing your search or filters.</p>
      <button
        type="button"
        onClick={onClearFilters}
        className="mt-4 rounded-lg border border-theme text-sm font-medium px-4 py-2 text-theme hover:bg-surface transition-colors"
      >
        Clear filters
      </button>
    </div>
  );
}
