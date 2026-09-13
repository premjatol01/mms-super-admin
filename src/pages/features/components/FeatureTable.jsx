import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import FeatureStatusBadge from "./FeatureStatusBadge";
import FeatureCategoryBadge from "./FeatureCategoryBadge";
import FeatureActionMenu from "./FeatureActionMenu";

const COLUMNS = [
  { key: "name", label: "Feature Name" },
  { key: "category", label: "Category" },
  { key: "status", label: "Status" },
  { key: "packages", label: "Package Usage" },
  { key: "updatedAt", label: "Updated" },
];

function SortIcon({ active, dir }) {
  if (!active) return <ArrowUpDown className="h-3.5 w-3.5 text-secondary/60" />;
  return dir === "asc" ? (
    <ArrowUp className="h-3.5 w-3.5 text-primary" />
  ) : (
    <ArrowDown className="h-3.5 w-3.5 text-primary" />
  );
}

export default function FeatureTable({
  features,
  sortBy,
  sortDir,
  onSort,
  onView,
  onEdit,
  onToggleStatus,
  onViewUsage,
}) {
  return (
    <div className="hidden overflow-x-auto rounded-xl border border-theme sm:block">
      <table className="w-full text-left text-sm">
        <thead className="bg-primary-light/10 text-xs uppercase tracking-wide text-secondary">
          <tr>
            {COLUMNS.map((col) => (
              <th key={col.key} className="px-4 py-3 font-medium">
                <button
                  onClick={() => onSort(col.key)}
                  className="inline-flex items-center gap-1 hover:text-theme"
                >
                  {col.label}
                  <SortIcon active={sortBy === col.key} dir={sortDir} />
                </button>
              </th>
            ))}
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {features.map((f) => (
            <tr key={f.id} className="border-t border-theme bg-surface">
              <td className="px-4 py-3">
                <p className="font-medium text-theme">{f.name}</p>
                <p className="text-xs text-secondary">{f.key}</p>
              </td>
              <td className="px-4 py-3">
                <FeatureCategoryBadge category={f.category} />
              </td>
              <td className="px-4 py-3">
                <FeatureStatusBadge status={f.status} />
              </td>
              <td className="px-4 py-3 text-secondary">
                {f.packages?.length || 0} Packages
              </td>
              <td className="px-4 py-3 text-secondary">{f.updatedAt}</td>
              <td className="px-4 py-3">
                <div className="flex justify-end">
                  <FeatureActionMenu
                    feature={f}
                    onView={onView}
                    onEdit={onEdit}
                    onToggleStatus={onToggleStatus}
                    onViewUsage={onViewUsage}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
