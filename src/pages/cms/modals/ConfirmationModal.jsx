import { AlertTriangle, X } from "lucide-react";

export default function ConfirmationModal({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-xl bg-surface p-5 shadow-xl">
        <div className="flex items-start justify-between">
          <span
            className={`flex h-10 w-10 items-center justify-center rounded-full ${
              destructive ? "bg-red-50 text-red-500" : "bg-primary-light text-theme"
            }`}
          >
            <AlertTriangle className="h-5 w-5" />
          </span>
          <button onClick={onCancel} className="text-secondary hover:text-theme">
            <X className="h-4 w-4" />
          </button>
        </div>
        <h3 className="mt-4 text-base font-semibold text-theme">{title}</h3>
        <p className="mt-1.5 text-sm text-secondary">{description}</p>
        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="rounded-lg border border-theme px-3.5 py-2 text-sm font-medium text-theme hover:bg-black/[0.03]"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`rounded-lg px-3.5 py-2 text-sm font-medium text-white hover:opacity-90 ${
              destructive ? "bg-red-500" : "bg-primary"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
