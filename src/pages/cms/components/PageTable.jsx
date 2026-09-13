import { Copy, Eye, Pencil, Trash2, UploadCloud, DownloadCloud } from "lucide-react";
import StatusBadge from "./StatusBadge.jsx";

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export default function PageTable({ pages, onEdit, onPreview, onTogglePublish, onDuplicate, onDelete }) {
  return (
    <div className="hidden overflow-x-auto rounded-xl border border-theme sm:block">
      <table className="w-full text-left text-sm">
        <thead className="bg-black/[0.02] text-xs uppercase tracking-wide text-secondary">
          <tr>
            <th className="px-4 py-3 font-medium">Page name</th>
            <th className="px-4 py-3 font-medium">Slug</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Last updated</th>
            <th className="px-4 py-3 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-theme">
          {pages.map((page) => (
            <tr key={page.id} className="hover:bg-black/[0.015]">
              <td className="px-4 py-3 font-medium text-theme">{page.name}</td>
              <td className="px-4 py-3 text-secondary">{page.slug}</td>
              <td className="px-4 py-3">
                <StatusBadge status={page.status} />
              </td>
              <td className="px-4 py-3 text-secondary">{formatDate(page.updatedAt)}</td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-1">
                  <button
                    title="Preview"
                    onClick={() => onPreview(page)}
                    className="rounded-md p-1.5 text-secondary hover:bg-black/[0.05] hover:text-theme"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    title="Edit"
                    onClick={() => onEdit(page)}
                    className="rounded-md p-1.5 text-secondary hover:bg-black/[0.05] hover:text-theme"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    title={page.status === "published" ? "Unpublish" : "Publish"}
                    onClick={() => onTogglePublish(page)}
                    className="rounded-md p-1.5 text-secondary hover:bg-black/[0.05] hover:text-theme"
                  >
                    {page.status === "published" ? (
                      <DownloadCloud className="h-4 w-4" />
                    ) : (
                      <UploadCloud className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    title="Duplicate"
                    onClick={() => onDuplicate(page)}
                    className="rounded-md p-1.5 text-secondary hover:bg-black/[0.05] hover:text-theme"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button
                    title="Delete"
                    onClick={() => onDelete(page)}
                    className="rounded-md p-1.5 text-red-400 hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
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
