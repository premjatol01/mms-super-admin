import { Circle } from "lucide-react";

const STYLES = {
  published: "bg-emerald-50 text-emerald-700 border-emerald-200",
  draft: "bg-amber-50 text-amber-700 border-amber-200",
  inactive: "bg-gray-100 text-gray-500 border-gray-200",
};

const DOT = {
  published: "text-emerald-500",
  draft: "text-amber-500",
  inactive: "text-gray-400",
};

export default function StatusBadge({ status }) {
  const key = (status || "").toLowerCase();
  const style = STYLES[key] || STYLES.inactive;
  const dot = DOT[key] || DOT.inactive;
  const label = status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${style}`}
    >
      <Circle className={`h-2 w-2 fill-current ${dot}`} strokeWidth={0} />
      {label}
    </span>
  );
}
