import { AlertTriangle } from 'lucide-react';

export default function ErrorState({ onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4 border border-dashed border-rose-200 bg-primary-light/30 rounded-xl">
      <div className="rounded-full bg-white p-3 mb-4">
        <AlertTriangle size={22} className="text-rose-600" />
      </div>
      <p className="font-medium text-theme">Unable to load offer configuration</p>
      <p className="text-sm text-secondary mt-1">Please try again.</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 rounded-lg bg-rose-600 text-white text-sm font-medium px-4 py-2 hover:bg-rose-700 transition-colors"
      >
        Retry
      </button>
    </div>
  );
}
