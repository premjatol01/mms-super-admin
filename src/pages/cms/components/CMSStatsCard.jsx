export default function CMSStatsCard({ label, value, icon: Icon, tint = "primary" }) {
  const tintClasses =
    tint === "secondary"
      ? "bg-secondary-light text-theme"
      : "bg-primary-light text-theme";

  return (
    <div className="rounded-xl border border-theme bg-surface p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-secondary">{label}</span>
        {Icon && (
          <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${tintClasses}`}>
            <Icon className="h-4 w-4" />
          </span>
        )}
      </div>
      <p className="mt-3 text-2xl font-semibold text-theme">{value}</p>
    </div>
  );
}
