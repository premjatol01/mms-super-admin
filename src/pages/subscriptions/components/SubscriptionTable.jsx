import { useState, useRef, useEffect } from "react";
import { MoreHorizontal, Eye, RefreshCw, Package, X, Check } from "lucide-react";

export default function SubscriptionTable({ 
  subscriptions, 
  onView,
  onRenew,
  onChangePackage,
}) {
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleActionClick = (action, sub) => {
    setOpenDropdownId(null);
    action(sub);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const getDaysRemaining = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return diff;
  };

  if (subscriptions.length === 0) {
    return (
      <div className="bg-surface border border-theme rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-primary-light/20">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-theme">Restaurant</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-theme">Package</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-theme">Duration</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-theme">Start</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-theme">End</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-theme">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-theme">Features</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-theme w-16">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-secondary">
                  No subscriptions found
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-theme rounded-xl overflow-hidden" ref={containerRef}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-primary-light/20">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-theme">Restaurant</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-theme">Package</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-theme">Duration</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-theme">Start</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-theme">End</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-theme">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-theme">Features</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-theme w-16">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((sub) => {
              const daysRemaining = getDaysRemaining(sub.endDate);
              return (
                <tr key={sub.id} className="border-b border-theme hover:bg-primary-light/10 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-theme">{sub.restaurantName}</p>
                      <p className="text-xs text-secondary">{sub.adminName}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-theme">{sub.packageName}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-theme">{sub.durationDisplay}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-secondary">{formatDate(sub.startDate)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <span className="text-sm text-secondary">{formatDate(sub.endDate)}</span>
                      {sub.status === "active" && daysRemaining > 0 && daysRemaining <= 7 && (
                        <p className="text-xs text-orange-500">{daysRemaining} days left</p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={sub.status} />
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-theme">{sub.features?.length || 0} Features</span>
                  </td>
                  <td className="px-4 py-3 relative">
                    <div className="relative">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenDropdownId(openDropdownId === sub.id ? null : sub.id);
                        }}
                        className="p-1.5 text-secondary hover:text-theme hover:bg-primary-light rounded-lg transition-colors"
                      >
                        {openDropdownId === sub.id ? <X size={16} /> : <MoreHorizontal size={16} />}
                      </button>
                      
                      {openDropdownId === sub.id && (
                        <div className="absolute right-0 top-full mt-1 bg-surface border border-theme rounded-lg shadow-lg z-20 w-44">
                          <button 
                            onClick={() => handleActionClick(onView, sub)}
                            className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-theme hover:bg-primary-light rounded-t-lg transition-colors"
                          >
                            <Eye size={14} /> View
                          </button>
                          <button 
                            onClick={() => handleActionClick(onRenew, sub)}
                            className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-theme hover:bg-primary-light transition-colors"
                          >
                            <RefreshCw size={14} /> Renew
                          </button>
                          <button 
                            onClick={() => handleActionClick(onChangePackage, sub)}
                            className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-theme hover:bg-primary-light rounded-b-lg transition-colors"
                          >
                            <Package size={14} /> Change
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const config = {
    active: { label: "Active", bg: "#22c55e20", color: "#22c55e" },
    expiring: { label: "Expiring", bg: "#f9731620", color: "#f97316" },
    expired: { label: "Expired", bg: "#ef444420", color: "#ef4444" },
    cancelled: { label: "Cancelled", bg: "#6b728020", color: "#6b7280" },
    scheduled: { label: "Scheduled", bg: "#3b82f620", color: "#3b82f6" },
  };
  
  const { label, bg, color } = config[status] || config.active;
  
  return (
    <span 
      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
      style={{ backgroundColor: bg, color }}
    >
      {label}
    </span>
  );
}