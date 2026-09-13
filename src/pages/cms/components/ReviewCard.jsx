import { Eye, Pencil, Star, Trash2, UploadCloud, DownloadCloud } from "lucide-react";
import StatusBadge from "./StatusBadge.jsx";

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export default function ReviewCard({ review, onEdit, onPreview, onTogglePublish, onDelete }) {
  return (
    <div className="flex flex-col rounded-xl border border-theme bg-surface p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex gap-0.5 text-amber-400">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-3.5 w-3.5" fill={i < (review.rating || 0) ? "currentColor" : "none"} />
          ))}
        </div>
        <StatusBadge status={review.status} />
      </div>

      <p className="mt-3 line-clamp-3 flex-1 text-sm text-secondary">&ldquo;{review.content}&rdquo;</p>

      <div className="mt-3 flex items-center justify-between text-xs text-secondary">
        <span className="font-medium text-theme">{review.reviewer}</span>
        <span>{formatDate(review.date)}</span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 border-t border-theme pt-3">
        <button
          onClick={() => onPreview(review)}
          className="inline-flex items-center gap-1.5 rounded-md border border-theme px-2.5 py-1.5 text-xs font-medium text-theme"
        >
          <Eye className="h-3.5 w-3.5" /> View
        </button>
        <button
          onClick={() => onEdit(review)}
          className="inline-flex items-center gap-1.5 rounded-md border border-theme px-2.5 py-1.5 text-xs font-medium text-theme"
        >
          <Pencil className="h-3.5 w-3.5" /> Edit
        </button>
        <button
          onClick={() => onTogglePublish(review)}
          className="inline-flex items-center gap-1.5 rounded-md border border-theme px-2.5 py-1.5 text-xs font-medium text-theme"
        >
          {review.status === "published" ? (
            <DownloadCloud className="h-3.5 w-3.5" />
          ) : (
            <UploadCloud className="h-3.5 w-3.5" />
          )}
          {review.status === "published" ? "Unpublish" : "Publish"}
        </button>
        <button
          onClick={() => onDelete(review)}
          className="ml-auto inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
