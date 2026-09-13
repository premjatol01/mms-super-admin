import { Eye, Pencil, Power, PowerOff } from "lucide-react";
import QRTemplatePreview from "./QRTemplatePreview";
import StatusBadge from "./StatusBadge";

export default function QRTemplateTable({
  templates,
  onView,
  onEdit,
  onToggleStatus,
}) {
  return (
    <div className="hidden overflow-hidden rounded-xl border border-theme sm:block">
      <table className="w-full text-left text-sm">
        <thead className="bg-primary-light/10 text-xs uppercase tracking-wide text-secondary">
          <tr>
            <th className="px-4 py-3 font-medium">Preview</th>
            <th className="px-4 py-3 font-medium">Template Name</th>
            <th className="px-4 py-3 font-medium">Type</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Updated</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {templates.map((t) => (
            <tr key={t.id} className="border-t border-theme bg-surface">
              <td className="px-4 py-3">
                <QRTemplatePreview name={t.name} size="sm" />
              </td>
              <td className="px-4 py-3 font-medium text-theme">{t.name}</td>
              <td className="px-4 py-3 text-secondary">{t.type}</td>
              <td className="px-4 py-3">
                <StatusBadge status={t.status} />
              </td>
              <td className="px-4 py-3 text-secondary">{t.updatedAt}</td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-1">
                  <button
                    onClick={() => onView(t)}
                    title="View"
                    className="rounded-lg p-2 text-secondary hover:bg-primary-light/20 hover:text-theme"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onEdit(t)}
                    title="Edit"
                    className="rounded-lg p-2 text-secondary hover:bg-primary-light/20 hover:text-theme"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onToggleStatus(t)}
                    title={t.status === "Active" ? "Deactivate" : "Activate"}
                    className="rounded-lg p-2 text-secondary hover:bg-primary-light/20 hover:text-theme"
                  >
                    {t.status === "Active" ? (
                      <PowerOff className="h-4 w-4" />
                    ) : (
                      <Power className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
