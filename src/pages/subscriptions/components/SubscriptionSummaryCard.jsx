import { Users, CheckCircle, Clock, XCircle } from "lucide-react";

export default function SubscriptionSummaryCard({ summary }) {
  const cards = [
    { label: "Total Subscriptions", value: summary.total, icon: Users, color: "bg-blue-500" },
    { label: "Active", value: summary.active, icon: CheckCircle, color: "bg-green-500" },
    { label: "Expiring Soon", value: summary.expiring, icon: Clock, color: "bg-orange-500" },
    { label: "Expired", value: summary.expired, icon: XCircle, color: "bg-red-500" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map(({ label, value, icon: Icon, color }) => (
        <div key={label} className="bg-surface border border-theme rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}>
              <Icon size={20} className="text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-theme">{value}</p>
              <p className="text-xs text-secondary">{label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}