import ModalShell from './ModalShell';

export default function UnsavedChangesModal({ open, onStay, onLeave }) {
  if (!open) return null;

  return (
    <ModalShell title="Unsaved Changes" onClose={onStay}>
      <p className="text-sm text-secondary">You have unsaved changes. Are you sure you want to leave?</p>

      <div className="mt-5 flex justify-end gap-2">
        <button
          type="button"
          onClick={onStay}
          className="rounded-lg border border-theme px-4 py-2 text-sm font-medium text-theme hover:bg-gray-50 transition-colors"
        >
          Stay
        </button>
        <button
          type="button"
          onClick={onLeave}
          className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 transition-colors"
        >
          Leave
        </button>
      </div>
    </ModalShell>
  );
}
