import { QrCode, Globe, Tag, Star, Layers } from "lucide-react";

const CATEGORY_META = {
  QR: { icon: QrCode, classes: "bg-primary-light/30 text-theme" },
  Website: { icon: Globe, classes: "bg-secondary-light text-theme" },
  Offers: { icon: Tag, classes: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400" },
  Reviews: { icon: Star, classes: "bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400" },
  Other: { icon: Layers, classes: "bg-gray-50 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400" },
};

export default function FeatureCategoryBadge({ category }) {
  const meta = CATEGORY_META[category] || CATEGORY_META.Other;
  const Icon = meta.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${meta.classes}`}
    >
      <Icon className="h-3 w-3" />
      {category}
    </span>
  );
}
