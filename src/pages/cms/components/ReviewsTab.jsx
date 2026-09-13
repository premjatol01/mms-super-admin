import { useMemo, useState } from "react";
import { Plus, Star } from "lucide-react";
import { SearchBar, FilterDropdown } from "./SearchFilters.jsx";
import { CardGridSkeleton } from "./LoadingState.jsx";
import EmptyState from "./EmptyState.jsx";
import ErrorState from "./ErrorState.jsx";
import ReviewCard from "./ReviewCard.jsx";

export default function ReviewsTab({
  reviews,
  loading,
  error,
  onRetry,
  onCreate,
  onEdit,
  onPreview,
  onTogglePublish,
  onDelete,
}) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  const filtered = useMemo(() => {
    return reviews.filter((r) => {
      const matchesSearch =
        !search ||
        r.reviewer.toLowerCase().includes(search.toLowerCase()) ||
        r.content.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = status === "All" || r.status === status.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [reviews, search, status]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchBar value={search} onChange={setSearch} placeholder="Search reviews..." />
          <FilterDropdown
            label="Status"
            value={status}
            options={["All", "Published", "Draft"]}
            onChange={setStatus}
          />
        </div>
        <button
          onClick={onCreate}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Add review
        </button>
      </div>

      {loading ? (
        <CardGridSkeleton />
      ) : error ? (
        <ErrorState onRetry={onRetry} />
      ) : filtered.length === 0 ? (
        reviews.length === 0 ? (
          <EmptyState icon={Star} title="No platform reviews available." />
        ) : (
          <EmptyState
            icon={Star}
            title="No matching content found."
            description="Try changing your search or filters."
          />
        )
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => (
            <ReviewCard
              key={r.id}
              review={r}
              onEdit={onEdit}
              onPreview={onPreview}
              onTogglePublish={onTogglePublish}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
