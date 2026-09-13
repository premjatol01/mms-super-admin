export default function UnsavedChangesModal({ open, onStay, onDiscard, onSave }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-xl bg-surface p-5 shadow-xl">
        <h3 className="text-base font-semibold text-theme">You have unsaved changes.</h3>
        <p className="mt-1.5 text-sm text-secondary">
          Do you want to leave without saving?
        </p>
        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <button
            onClick={onStay}
            className="rounded-lg border border-theme px-3.5 py-2 text-sm font-medium text-theme hover:bg-black/[0.03]"
          >
            Stay
          </button>
          <button
            onClick={onDiscard}
            className="rounded-lg border border-theme px-3.5 py-2 text-sm font-medium text-red-500 hover:bg-red-50"
          >
            Discard changes
          </button>
          <button
            onClick={onSave}
            className="rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}
