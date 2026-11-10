import { Save, Loader2, RotateCcw } from 'lucide-react';

export default function SaveChangesBar({ onCancel, onSave, isSaving, isDirty = true }) {
  return (
    <div className="sticky bottom-4 z-30 flex items-center justify-between gap-3 rounded-xl border border-theme bg-surface/95 backdrop-blur-md shadow-lg px-4 py-3">
      <div className="text-xs text-secondary hidden sm:block">
        {isDirty ? (
          <span className="text-amber-600 dark:text-amber-400 font-medium">● Unsaved changes</span>
        ) : (
          <span>All settings saved to database</span>
        )}
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSaving || !isDirty}
          className="inline-flex items-center gap-1.5 rounded-lg border border-theme px-3.5 py-2 text-sm font-medium text-theme hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-40 cursor-pointer"
        >
          <RotateCcw size={14} />
          Reset
        </button>
        <button
          type="submit"
          onClick={onSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-5 py-2 text-sm font-medium text-white hover:bg-teal-700 transition-colors disabled:opacity-60 shadow-sm cursor-pointer"
        >
          {isSaving ? (
            <>
              <Loader2 size={15} className="animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Save size={15} /> Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
}
