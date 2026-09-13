import { X } from "lucide-react";

export default function ModalShell({ open, title, onClose, children, footer, wide = false }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
      <div
        className={`flex max-h-full w-full ${
          wide ? "max-w-3xl" : "max-w-lg"
        } flex-col overflow-hidden rounded-xl bg-surface shadow-xl`}
      >
        <div className="flex items-center justify-between border-b border-theme px-5 py-4">
          <h3 className="text-base font-semibold text-theme">{title}</h3>
          <button onClick={onClose} className="text-secondary hover:text-theme">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-4">{children}</div>
        {footer && <div className="border-t border-theme px-5 py-4">{footer}</div>}
      </div>
    </div>
  );
}
