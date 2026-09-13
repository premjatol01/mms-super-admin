import { Circle } from "lucide-react";

const VARIANTS = {
  Active: "bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20",
  Enabled: "bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20",
  Inactive: "bg-gray-50 text-gray-500 border-gray-200 dark:bg-gray-500/10 dark:text-gray-400 dark:border-gray-500/20",
  Disabled: "bg-gray-50 text-gray-500 border-gray-200 dark:bg-gray-500/10 dark:text-gray-400 dark:border-gray-500/20",
};

export default function StatusBadge({ status }) {
  const classes = VARIANTS[status] || VARIANTS.Inactive;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${classes}`}
    >
      <Circle className="h-2 w-2 fill-current" strokeWidth={0} />
      {status}
    </span>
  );
}
