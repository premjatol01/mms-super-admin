import { Eye, Pencil, Star, Trash2, UploadCloud, DownloadCloud } from "lucide-react";
import StatusBadge from "./StatusBadge.jsx";

export default function TestimonialCard({ testimonial, onEdit, onPreview, onTogglePublish, onDelete }) {
  return (
    <div className="flex flex-col rounded-xl border border-theme bg-surface p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary-light text-sm font-medium text-theme">
            {testimonial.name?.charAt(0) || "?"}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-theme">{testimonial.name}</p>
            {testimonial.role && (
              <p className="truncate text-xs text-secondary">{testimonial.role}</p>
            )}
          </div>
        </div>
        <StatusBadge status={testimonial.status} />
      </div>

      <div className="mt-3 flex gap-0.5 text-amber-400">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="h-3.5 w-3.5" fill={i < (testimonial.rating || 0) ? "currentColor" : "none"} />
        ))}
      </div>

      <p className="mt-2 line-clamp-3 flex-1 text-sm text-secondary">&ldquo;{testimonial.content}&rdquo;</p>

      <div className="mt-4 flex flex-wrap gap-2 border-t border-theme pt-3">
        <button
          onClick={() => onPreview(testimonial)}
          className="inline-flex items-center gap-1.5 rounded-md border border-theme px-2.5 py-1.5 text-xs font-medium text-theme"
        >
          <Eye className="h-3.5 w-3.5" /> View
        </button>
        <button
          onClick={() => onEdit(testimonial)}
          className="inline-flex items-center gap-1.5 rounded-md border border-theme px-2.5 py-1.5 text-xs font-medium text-theme"
        >
          <Pencil className="h-3.5 w-3.5" /> Edit
        </button>
        <button
          onClick={() => onTogglePublish(testimonial)}
          className="inline-flex items-center gap-1.5 rounded-md border border-theme px-2.5 py-1.5 text-xs font-medium text-theme"
        >
          {testimonial.status === "published" ? (
            <DownloadCloud className="h-3.5 w-3.5" />
          ) : (
            <UploadCloud className="h-3.5 w-3.5" />
          )}
          {testimonial.status === "published" ? "Unpublish" : "Publish"}
        </button>
        <button
          onClick={() => onDelete(testimonial)}
          className="ml-auto inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
