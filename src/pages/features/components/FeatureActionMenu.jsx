import { useEffect, useRef, useState } from "react";
import { MoreVertical, Eye, Pencil, Power, PowerOff, Layers } from "lucide-react";

export default function FeatureActionMenu({
  feature,
  onView,
  onEdit,
  onToggleStatus,
  onViewUsage,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const item = (icon, label, onClick) => (
    <button
      onClick={() => {
        setOpen(false);
        onClick();
      }}
      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-theme hover:bg-primary-light/20"
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="rounded-lg p-2 text-secondary hover:bg-primary-light/20 hover:text-theme"
      >
        <MoreVertical className="h-4 w-4" />
      </button>
      {open && (
        <div className="absolute right-0 z-20 mt-1 w-48 overflow-hidden rounded-lg border border-theme bg-surface shadow-lg">
          {item(<Eye className="h-4 w-4" />, "View", () => onView(feature))}
          {item(<Pencil className="h-4 w-4" />, "Edit", () => onEdit(feature))}
          {item(
            feature.status === "Active" ? (
              <PowerOff className="h-4 w-4" />
            ) : (
              <Power className="h-4 w-4" />
            ),
            feature.status === "Active" ? "Deactivate" : "Activate",
            () => onToggleStatus(feature)
          )}
          {item(<Layers className="h-4 w-4" />, "View Package Usage", () =>
            onViewUsage(feature)
          )}
        </div>
      )}
    </div>
  );
}
