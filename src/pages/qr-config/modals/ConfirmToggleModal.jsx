import { X, AlertTriangle } from "lucide-react";

export default function ConfirmToggleModal({ qrCode, onCancel, onConfirm }) {
  if (!qrCode) return null;
  const willActivate = qrCode.status !== "active";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-xl bg-surface p-5 shadow-lg">
        <div className="flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-light">
            <AlertTriangle size={18} className="text-theme" />
          </div>
          <button
            onClick={onCancel}
            className="text-secondary hover:text-theme"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <h3 className="mt-3 text-sm font-semibold text-theme">
          {willActivate ? "Activate this QR code?" : "Deactivate this QR code?"}
        </h3>
        <p className="mt-1 text-sm text-secondary">
          {willActivate
            ? `"${qrCode.name}" will become scannable and visible again.`
            : `"${qrCode.name}" will stop working for anyone who scans it.`}
        </p>

        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="rounded-lg border border-theme px-3.5 py-2 text-sm font-medium text-theme hover:bg-theme"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(qrCode)}
            className="rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-theme hover:bg-primary-light"
          >
            {willActivate ? "Activate" : "Deactivate"}
          </button>
        </div>
      </div>
    </div>
  );
}
