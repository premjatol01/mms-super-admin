import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import QrCodeCard from "./QrCodeCard";
import EmptyState from "./EmptyState";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

export default function QrCodeList({
  qrCodes,
  restaurants,
  isLoading,
  onAdd,
  onEdit,
  onToggleStatus,
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const restaurantNameById = useMemo(() => {
    const map = {};
    (restaurants || []).forEach((r) => {
      map[r.id] = r.name;
    });
    return map;
  }, [restaurants]);

  const filteredQrCodes = useMemo(() => {
    return (qrCodes || []).filter((qr) => {
      const matchesSearch = qr.name
        .toLowerCase()
        .includes(search.trim().toLowerCase());
      const matchesStatus =
        statusFilter === "all" || qr.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [qrCodes, search, statusFilter]);

  const hasFilters = search.trim().length > 0 || statusFilter !== "all";

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-secondary"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search QR codes"
            className="w-full rounded-lg border border-theme bg-surface py-2 pl-9 pr-3 text-sm text-theme outline-none focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-1 rounded-lg border border-theme bg-surface p-1">
          {FILTERS.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                statusFilter === filter.value
                  ? "bg-primary text-theme"
                  : "text-secondary hover:text-theme"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-44 animate-pulse rounded-xl border border-theme bg-surface"
            />
          ))}
        </div>
      ) : filteredQrCodes.length === 0 ? (
        <EmptyState onAdd={onAdd} hasFilters={hasFilters} />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredQrCodes.map((qrCode) => (
            <QrCodeCard
              key={qrCode.id}
              qrCode={qrCode}
              restaurantName={restaurantNameById[qrCode.restaurantId]}
              onEdit={onEdit}
              onToggleStatus={onToggleStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
}
