import { X } from "lucide-react";
import { useEffect } from "react";

export default function Modal({ isOpen, onClose, title, children, size = "md" }) {
  const sizes = { sm: "max-w-md", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl" };

  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onClose();
    if (isOpen) { document.addEventListener("keydown", esc); document.body.style.overflow = "hidden"; }
    return () => { document.removeEventListener("keydown", esc); document.body.style.overflow = ""; };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={onClose} />
      <div className={`relative bg-surface rounded-xl border border-theme-faded w-full ${sizes[size]} max-h-[90vh] overflow-hidden flex flex-col shadow-xl`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-theme-faded">
          <h2 className="text-lg font-semibold text-theme">{title}</h2>
          <button onClick={onClose} className="p-1 text-secondary hover:text-theme rounded cursor-pointer"><X size={20} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}
