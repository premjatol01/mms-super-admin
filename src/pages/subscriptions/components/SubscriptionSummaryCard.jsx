import { Users, CheckCircle, Clock, XCircle, Zap } from "lucide-react";

export default function SubscriptionSummaryCard({ summary }) {
  const pendingCount = summary.pendingVerification || 0;

  const cards = [
    { label: "Total Subscriptions", value: summary.total || 0, icon: Users, color: "bg-blue-500" },
    { label: "Active", value: summary.active || 0, icon: CheckCircle, color: "bg-green-500" },
    { label: "Expiring Soon", value: summary.expiring || 0, icon: Clock, color: "bg-orange-500" },
    { label: "Expired", value: summary.expired || 0, icon: XCircle, color: "bg-red-500" },
    {
      label: "Pending Verification",
      value: pendingCount,
      icon: Zap,
      color: "bg-amber-500",
      alert: pendingCount > 0,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
      {cards.map(({ label, value, icon: Icon, color, alert }) => (
        <div
          key={label}
          className={`bg-surface border rounded-xl p-3.5 transition-all ${
            alert
              ? "border-amber-400 bg-amber-500/10 shadow-xs ring-2 ring-amber-400/20"
              : "border-theme"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center shrink-0`}>
              <Icon size={18} className="text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-2xl font-bold text-theme leading-tight">{value}</p>
              <p className="text-xs text-secondary truncate">{label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
