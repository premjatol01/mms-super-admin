import { Search } from 'lucide-react';
import { OFFER_TYPES } from '../data/offersData';

function Select({ value, onChange, options, label }) {
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-lg border border-theme bg-surface text-sm text-theme px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

export default function SearchFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  typeFilter,
  onTypeFilterChange,
  packageUsageFilter,
  onPackageUsageFilterChange,
}) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center gap-3">
      <div className="relative flex-1 min-w-0">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search offer features..."
          className="w-full rounded-lg border border-theme bg-surface pl-9 pr-3 py-2 text-sm text-theme placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-teal-600"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Select
          label="Filter by status"
          value={statusFilter}
          onChange={onStatusFilterChange}
          options={[
            { value: 'all', label: 'All statuses' },
            { value: 'Enabled', label: 'Enabled' },
            { value: 'Disabled', label: 'Disabled' },
          ]}
        />
        <Select
          label="Filter by offer type"
          value={typeFilter}
          onChange={onTypeFilterChange}
          options={[{ value: 'all', label: 'All offer types' }, ...Object.entries(OFFER_TYPES).map(([value, label]) => ({ value, label }))]}
        />
        <Select
          label="Filter by package usage"
          value={packageUsageFilter}
          onChange={onPackageUsageFilterChange}
          options={[
            { value: 'all', label: 'All packages' },
            { value: 'used', label: 'Used in packages' },
            { value: 'unused', label: 'Not used in packages' },
          ]}
        />
      </div>
    </div>
  );
}
