import { Copy, Eye, Pencil, Trash2, UploadCloud, DownloadCloud } from "lucide-react";
import StatusBadge from "./StatusBadge.jsx";

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function PageCard({ pages, onEdit, onPreview, onTogglePublish, onDuplicate, onDelete }) {
  return (
    <div className="space-y-3 sm:hidden">
      {pages.map((page) => (
        <div key={page.id} className="rounded-xl border border-theme bg-surface p-4">
          <div className="flex items-start justify-between">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-theme">{page.name}</p>
              <p className="truncate text-xs text-secondary">{page.slug}</p>
            </div>
            <StatusBadge status={page.status} />
          </div>
          <p className="mt-2 text-xs text-secondary">Updated {formatDate(page.updatedAt)}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={() => onPreview(page)}
              className="inline-flex items-center gap-1.5 rounded-md border border-theme px-2.5 py-1.5 text-xs font-medium text-theme"
            >
              <Eye className="h-3.5 w-3.5" /> View
            </button>
            <button
              onClick={() => onEdit(page)}
              className="inline-flex items-center gap-1.5 rounded-md border border-theme px-2.5 py-1.5 text-xs font-medium text-theme"
            >
              <Pencil className="h-3.5 w-3.5" /> Edit
            </button>
            <button
              onClick={() => onTogglePublish(page)}
              className="inline-flex items-center gap-1.5 rounded-md border border-theme px-2.5 py-1.5 text-xs font-medium text-theme"
            >
              {page.status === "published" ? (
                <DownloadCloud className="h-3.5 w-3.5" />
              ) : (
                <UploadCloud className="h-3.5 w-3.5" />
              )}
              {page.status === "published" ? "Unpublish" : "Publish"}
            </button>
            <button
              onClick={() => onDuplicate(page)}
              className="inline-flex items-center gap-1.5 rounded-md border border-theme px-2.5 py-1.5 text-xs font-medium text-theme"
            >
              <Copy className="h-3.5 w-3.5" /> Duplicate
            </button>
            <button
              onClick={() => onDelete(page)}
              className="inline-flex items-center gap-1.5 rounded-md border border-theme px-2.5 py-1.5 text-xs font-medium text-red-500"
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
