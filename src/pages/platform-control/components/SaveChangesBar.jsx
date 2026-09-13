export default function SaveChangesBar({ onCancel, onSave, isSaving }) {
  return (
    <div className="sticky bottom-4 z-30 flex items-center justify-end gap-2 rounded-xl border border-theme bg-surface shadow-lg px-4 py-3">
      <button
        type="button"
        onClick={onCancel}
        disabled={isSaving}
        className="rounded-lg border border-theme px-4 py-2 text-sm font-medium text-theme hover:bg-gray-50 transition-colors disabled:opacity-60"
      >
        Cancel
      </button>
      <button
        type="submit"
        onClick={onSave}
        disabled={isSaving}
        className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 transition-colors disabled:opacity-60"
      >
        {isSaving ? 'Saving...' : 'Save changes'}
      </button>
    </div>
  );
}
