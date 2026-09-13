import ModalShell from './ModalShell';

/**
 * confirmation shape: { title, message, confirmLabel, tone: 'disable' | 'enable' }
 */
export default function ConfirmationModal({ confirmation, onCancel, onConfirm }) {
  if (!confirmation) return null;

  const { title, message, confirmLabel, tone } = confirmation;
  const isDisable = tone === 'disable';

  return (
    <ModalShell title={title} onClose={onCancel}>
      <p className="text-sm text-secondary">{message}</p>

      <div className="mt-5 flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-theme px-4 py-2 text-sm font-medium text-theme hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors ${
            isDisable ? 'bg-rose-600 hover:bg-rose-700' : 'bg-teal-600 hover:bg-teal-700'
          }`}
        >
          {confirmLabel}
        </button>
      </div>
    </ModalShell>
  );
}
