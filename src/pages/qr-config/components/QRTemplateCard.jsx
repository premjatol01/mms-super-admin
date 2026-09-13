import { Eye, Pencil, Power, PowerOff } from "lucide-react";
import QRTemplatePreview from "./QRTemplatePreview";
import StatusBadge from "./StatusBadge";

export default function QRTemplateCard({
  template,
  onView,
  onEdit,
  onToggleStatus,
}) {
  return (
    <div className="flex gap-3 rounded-xl border border-theme bg-surface p-4 sm:hidden">
      <QRTemplatePreview name={template.name} />
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <p className="font-medium text-theme">{template.name}</p>
            <StatusBadge status={template.status} />
          </div>
          <p className="mt-0.5 text-sm text-secondary">{template.type}</p>
        </div>
        <div className="mt-2 flex gap-2">
          <button
            onClick={() => onView(template)}
            className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-theme py-1.5 text-xs font-medium text-theme"
          >
            <Eye className="h-3.5 w-3.5" /> View
          </button>
          <button
            onClick={() => onEdit(template)}
            className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-theme py-1.5 text-xs font-medium text-theme"
          >
            <Pencil className="h-3.5 w-3.5" /> Edit
          </button>
          <button
            onClick={() => onToggleStatus(template)}
            className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-theme py-1.5 text-xs font-medium text-theme"
          >
            {template.status === "Active" ? (
              <PowerOff className="h-3.5 w-3.5" />
            ) : (
              <Power className="h-3.5 w-3.5" />
            )}
            {template.status === "Active" ? "Off" : "On"}
          </button>
        </div>
      </div>
    </div>
  );
}
