import ModalShell from './ModalShell';

export default function UnsavedChangesModal({ open, onStay, onDiscard }) {
  if (!open) return null;

  return (
    <ModalShell title="Discard unsaved changes?" onClose={onStay}>
      <p className="text-sm text-secondary">
        You have changes that haven't been saved yet. Leaving now will discard them.
      </p>

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
          onClick={onDiscard}
          className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 transition-colors"
        >
          Discard changes
        </button>
      </div>
    </ModalShell>
  );
}
