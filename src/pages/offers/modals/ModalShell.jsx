import { X } from 'lucide-react';
import { useEffect } from 'react';

export default function ModalShell({ title, onClose, children, maxWidth = 'max-w-md' }) {
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/40" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`relative w-full ${maxWidth} bg-surface rounded-xl shadow-xl border border-theme max-h-[85vh] overflow-y-auto`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-theme sticky top-0 bg-surface">
          <h2 className="font-semibold text-theme">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-lg text-secondary hover:bg-gray-100 hover:text-theme transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
      </div>
    </div>
  );
}
