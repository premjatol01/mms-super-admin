import { Search, X } from "lucide-react";

export function SearchBar({ value, onChange, placeholder = "Search content..." }) {
  return (
    <div className="relative w-full sm:max-w-xs">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-theme bg-surface py-2 pl-9 pr-8 text-sm text-theme outline-none focus:border-primary"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-secondary hover:text-theme"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

export function FilterDropdown({ label, value, options, onChange }) {
  return (
    <label className="flex items-center gap-2 text-sm text-secondary">
      {label && <span className="hidden sm:inline">{label}</span>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-theme bg-surface px-2.5 py-2 text-sm text-theme outline-none focus:border-primary"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}
