import { Search } from "lucide-react";
import { CATEGORIES } from "../data/mockData";

export default function FeatureFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  status,
  onStatusChange,
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative w-full sm:max-w-xs">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search features..."
          className="w-full rounded-lg border border-theme bg-theme py-2 pl-9 pr-3 text-sm text-theme outline-none focus:border-primary"
        />
      </div>

      <select
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="rounded-lg border border-theme bg-theme px-3 py-2 text-sm text-theme outline-none focus:border-primary"
      >
        <option value="All">All Categories</option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        className="rounded-lg border border-theme bg-theme px-3 py-2 text-sm text-theme outline-none focus:border-primary"
      >
        <option value="All">All Status</option>
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>
    </div>
  );
}
