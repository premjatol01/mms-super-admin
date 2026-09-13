import { useMemo, useState } from "react";
import { FileText, Plus } from "lucide-react";
import { SearchBar, FilterDropdown } from "./SearchFilters.jsx";
import { TableSkeleton } from "./LoadingState.jsx";
import EmptyState from "./EmptyState.jsx";
import ErrorState from "./ErrorState.jsx";
import PageTable from "./PageTable.jsx";
import PageCard from "./PageCard.jsx";

export default function PagesTab({
  pages,
  loading,
  error,
  onRetry,
  onCreate,
  onEdit,
  onPreview,
  onTogglePublish,
  onDuplicate,
  onDelete,
}) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  const filtered = useMemo(() => {
    return pages.filter((p) => {
      const matchesSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.slug.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = status === "All" || p.status === status.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [pages, search, status]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchBar value={search} onChange={setSearch} placeholder="Search pages..." />
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
          Create page
        </button>
      </div>

      {loading ? (
        <TableSkeleton />
      ) : error ? (
        <ErrorState onRetry={onRetry} />
      ) : filtered.length === 0 ? (
        pages.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No pages found."
            description="Create your first public website page."
            actionLabel="Create page"
            onAction={onCreate}
          />
        ) : (
          <EmptyState
            icon={FileText}
            title="No matching content found."
            description="Try changing your search or filters."
          />
        )
      ) : (
        <>
          <PageTable
            pages={filtered}
            onEdit={onEdit}
            onPreview={onPreview}
            onTogglePublish={onTogglePublish}
            onDuplicate={onDuplicate}
            onDelete={onDelete}
          />
          <PageCard
            pages={filtered}
            onEdit={onEdit}
            onPreview={onPreview}
            onTogglePublish={onTogglePublish}
            onDuplicate={onDuplicate}
            onDelete={onDelete}
          />
        </>
      )}
    </div>
  );
}
