export function QRConfigSummaryCard({ label, value, icon: Icon, tone = "default" }) {
  const toneClasses =
    tone === "positive"
      ? "text-green-600 dark:text-green-400"
      : tone === "negative"
      ? "text-red-500"
      : "text-theme";

  return (
    <div className="rounded-xl border border-theme bg-surface p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-secondary">
          {label}
        </span>
        {Icon && <Icon className="h-4 w-4 text-secondary" />}
      </div>
      <p className={`mt-2 text-lg font-semibold ${toneClasses}`}>{value}</p>
    </div>
  );
}

export default function QRConfigSummaryCards({
  availability,
  activeTemplateCount,
}) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <QRConfigSummaryCard
        label="Default QR"
        value={availability.defaultQr.enabled ? "Enabled" : "Disabled"}
        tone={availability.defaultQr.enabled ? "positive" : "negative"}
      />
      <QRConfigSummaryCard
        label="Premium QR"
        value={availability.premiumQr.enabled ? "Enabled" : "Disabled"}
        tone={availability.premiumQr.enabled ? "positive" : "negative"}
      />
      <QRConfigSummaryCard
        label="Paid QR"
        value={availability.paidQr.enabled ? "Enabled" : "Disabled"}
        tone={availability.paidQr.enabled ? "positive" : "negative"}
      />
      <QRConfigSummaryCard
        label="Available Templates"
        value={activeTemplateCount}
      />
    </div>
  );
}
