import { Pencil } from "lucide-react";
import { format } from "date-fns";
import StatusBadge from "./StatusBadge";
import AssignmentBadge from "./AssignmentBadge";

export default function QrCodeCard({
  qrCode,
  restaurantName,
  onEdit,
  onToggleStatus,
}) {
  const isActive = qrCode.status === "active";

  return (
    <div className="flex flex-col rounded-xl border border-theme bg-surface p-4 transition-shadow hover:shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center justify-center rounded-lg border border-theme bg-theme p-2">
          {qrCode.imageUrl ? (
            <img
              src={qrCode.imageUrl}
              alt={qrCode.name}
              className="h-16 w-16 object-contain"
            />
          ) : (
            <div className="h-16 w-16 rounded bg-theme" />
          )}
        </div>
        <StatusBadge status={qrCode.status} />
      </div>

      <div className="mt-3 flex-1">
        <h3 className="text-sm font-semibold text-theme">{qrCode.name}</h3>
        {qrCode.description ? (
          <p className="mt-1 line-clamp-2 text-xs text-secondary">
            {qrCode.description}
          </p>
        ) : null}
        <div className="mt-2">
          <AssignmentBadge
            assignment={qrCode.assignment}
            restaurantName={restaurantName}
          />
        </div>
        {qrCode.createdAt && (
          <p className="mt-1 text-[11px] text-secondary">
            Added {format(new Date(qrCode.createdAt), "d MMM yyyy")}
          </p>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-theme pt-3">
        <button
          onClick={() => onEdit(qrCode)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-theme hover:text-primary"
        >
          <Pencil size={14} />
          Edit
        </button>

        <button
          onClick={() => onToggleStatus(qrCode)}
          role="switch"
          aria-checked={isActive}
          aria-label={isActive ? "Deactivate QR code" : "Activate QR code"}
          className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
          style={{
            backgroundColor: isActive
              ? "var(--color-secondary)"
              : "var(--color-border)",
          }}
        >
          <span
            className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
            style={{
              transform: isActive ? "translateX(22px)" : "translateX(4px)",
            }}
          />
        </button>
      </div>
    </div>
  );
}
