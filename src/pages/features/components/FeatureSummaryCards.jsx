function SummaryCard({ label, value, tone = "default" }) {
  const toneClasses =
    tone === "positive"
      ? "text-green-600 dark:text-green-400"
      : tone === "negative"
      ? "text-red-500"
      : "text-theme";

  return (
    <div className="rounded-xl border border-theme bg-surface p-4">
      <span className="text-xs font-medium uppercase tracking-wide text-secondary">
        {label}
      </span>
      <p className={`mt-2 text-lg font-semibold ${toneClasses}`}>{value}</p>
    </div>
  );
}

export default function FeatureSummaryCards({ features }) {
  const total = features.length;
  const active = features.filter((f) => f.status === "Active").length;
  const inactive = total - active;
  const usedInPackages = features.filter((f) => (f.packages?.length || 0) > 0).length;

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <SummaryCard label="Total Features" value={total} />
      <SummaryCard label="Active" value={active} tone="positive" />
      <SummaryCard label="Inactive" value={inactive} tone={inactive > 0 ? "negative" : "default"} />
      <SummaryCard label="Used in Packages" value={usedInPackages} />
    </div>
  );
}
