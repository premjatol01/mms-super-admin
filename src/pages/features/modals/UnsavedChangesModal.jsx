export default function UnsavedChangesModal({ open, onStay, onLeave }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-xl bg-surface p-5 shadow-xl">
        <h3 className="text-base font-semibold text-theme">
          Unsaved Changes
        </h3>
        <p className="mt-1 text-sm text-secondary">
          You have unsaved changes. Do you want to leave this page?
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onStay}
            className="rounded-lg border border-theme px-4 py-2 text-sm font-medium text-theme hover:bg-primary-light/20"
          >
            Stay
          </button>
          <button
            onClick={onLeave}
            className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            Leave
          </button>
        </div>
      </div>
    </div>
  );
}
