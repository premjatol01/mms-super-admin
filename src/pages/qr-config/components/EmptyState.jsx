import { QrCode, Plus } from "lucide-react";

export default function EmptyState({ onAdd, hasFilters }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-theme px-6 py-16 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-light">
        <QrCode size={22} className="text-theme" />
      </div>
      <h3 className="text-base font-semibold text-theme">
        {hasFilters ? "No matching QR codes" : "No QR codes yet"}
      </h3>
      <p className="mt-1 max-w-sm text-sm text-secondary">
        {hasFilters
          ? "Try adjusting your search."
          : "Add your first QR code to make it available for tables, kiosks, or promotions."}
      </p>
      {!hasFilters && (
        <button
          onClick={onAdd}
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-theme hover:bg-primary-light"
        >
          <Plus size={16} />
          Add QR Code
        </button>
      )}
    </div>
  );
}
