export default function UnsavedChangesBar({ onSave, onDiscard }) {
  return (
    <div className="sticky bottom-4 z-30 flex items-center justify-between gap-4 rounded-xl border border-theme bg-surface shadow-lg px-4 py-3">
      <p className="text-sm text-theme">You have unsaved changes.</p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onDiscard}
          className="rounded-lg border border-theme px-3 py-1.5 text-sm font-medium text-theme hover:bg-gray-50 transition-colors"
        >
          Discard
        </button>
        <button
          type="button"
          onClick={onSave}
          className="rounded-lg bg-teal-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-teal-700 transition-colors"
        >
          Save changes
        </button>
      </div>
    </div>
  );
}
