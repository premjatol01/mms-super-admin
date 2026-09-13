import { FileImage, Link2, Trash2 } from "lucide-react";

function formatSize(bytes) {
  if (!bytes) return "—";
  return `${(bytes / 1024).toFixed(0)} KB`;
}

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function MediaCard({ media, onCopy, onDelete }) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-theme bg-surface">
      <div className="flex aspect-square items-center justify-center bg-black/[0.03]">
        {media.url ? (
          <img src={media.url} alt={media.name} className="h-full w-full object-cover" />
        ) : (
          <FileImage className="h-8 w-8 text-secondary" />
        )}
      </div>
      <div className="p-2.5">
        <p className="truncate text-xs font-medium text-theme">{media.name}</p>
        <p className="text-[11px] text-secondary">
          {formatSize(media.size)} · {formatDate(media.uploadedAt)}
        </p>
      </div>
      <div className="absolute inset-x-0 top-0 flex justify-end gap-1 bg-gradient-to-b from-black/40 to-transparent p-1.5 opacity-0 transition group-hover:opacity-100">
        <button
          title="Copy URL"
          onClick={() => onCopy(media)}
          className="rounded-md bg-white/90 p-1.5 text-theme hover:bg-white"
        >
          <Link2 className="h-3.5 w-3.5" />
        </button>
        <button
          title="Delete"
          onClick={() => onDelete(media)}
          className="rounded-md bg-white/90 p-1.5 text-red-500 hover:bg-white"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
