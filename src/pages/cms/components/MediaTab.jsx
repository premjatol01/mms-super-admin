import { useMemo, useState } from "react";
import { ImageIcon, Upload } from "lucide-react";
import { SearchBar } from "./SearchFilters.jsx";
import { CardGridSkeleton } from "./LoadingState.jsx";
import EmptyState from "./EmptyState.jsx";
import ErrorState from "./ErrorState.jsx";
import MediaCard from "./MediaCard.jsx";

export default function MediaTab({ media, loading, error, onRetry, onUpload, onCopy, onDelete }) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () => media.filter((m) => !search || m.name.toLowerCase().includes(search.toLowerCase())),
    [media, search]
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar value={search} onChange={setSearch} placeholder="Search media..." />
        <button
          onClick={onUpload}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          <Upload className="h-4 w-4" />
          Upload media
        </button>
      </div>

      {loading ? (
        <CardGridSkeleton />
      ) : error ? (
        <ErrorState onRetry={onRetry} />
      ) : filtered.length === 0 ? (
        media.length === 0 ? (
          <EmptyState
            icon={ImageIcon}
            title="No media uploaded yet."
            actionLabel="Upload media"
            onAction={onUpload}
          />
        ) : (
          <EmptyState
            icon={ImageIcon}
            title="No matching content found."
            description="Try changing your search."
          />
        )
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {filtered.map((m) => (
            <MediaCard key={m.id} media={m} onCopy={onCopy} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
