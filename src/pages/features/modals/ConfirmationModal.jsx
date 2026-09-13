import { AlertTriangle, X } from "lucide-react";

export default function ConfirmationModal({ config, onCancel }) {
  if (!config) return null;
  const {
    title,
    description,
    confirmLabel = "Confirm",
    tone = "warning", // 'warning' | 'danger'
    onConfirm,
  } = config;

  const confirmClasses =
    tone === "danger"
      ? "bg-red-500 hover:opacity-90"
      : "bg-primary hover:opacity-90";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-xl bg-surface p-5 shadow-xl">
        <div className="flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-500/10">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
          </div>
          <button
            onClick={onCancel}
            className="rounded-lg p-1 text-secondary hover:bg-primary-light/20"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <h3 className="mt-3 text-base font-semibold text-theme">{title}</h3>
        {description && (
          <p className="mt-1 text-sm text-secondary">{description}</p>
        )}
        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="rounded-lg border border-theme px-4 py-2 text-sm font-medium text-theme hover:bg-primary-light/20"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`rounded-lg px-4 py-2 text-sm font-medium text-white ${confirmClasses}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
