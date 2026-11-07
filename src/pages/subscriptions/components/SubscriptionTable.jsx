import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { MoreHorizontal, Eye, RefreshCw, Package, X, CheckCircle, Clock, XCircle } from "lucide-react";

export default function SubscriptionTable({ 
  subscriptions, 
  loading,
  onView,
  onRenew,
  onChangePackage,
}) {
  const [dropdownMenu, setDropdownMenu] = useState(null);

  useEffect(() => {
    if (!dropdownMenu) return;

    const handleClickOutside = (event) => {
      const menuEl = document.getElementById("subscription-actions-dropdown");
      if (menuEl && !menuEl.contains(event.target)) {
        if (event.target.closest("[data-dropdown-trigger]")) {
          return;
        }
        setDropdownMenu(null);
      }
    };

    const handleScrollOrResize = () => {
      setDropdownMenu(null);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [dropdownMenu]);

  const handleToggleDropdown = (e, sub) => {
    e.stopPropagation();
    const subId = sub._id || sub.id;
    if (dropdownMenu?.id === subId) {
      setDropdownMenu(null);
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const menuHeight = 150;
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUpward = spaceBelow < menuHeight && rect.top > menuHeight;

    setDropdownMenu({
      id: subId,
      sub,
      top: openUpward ? rect.top - menuHeight - 6 : rect.bottom + 6,
      right: Math.max(16, window.innerWidth - rect.right),
    });
  };

  const handleActionClick = (action, sub) => {
    setDropdownMenu(null);
    action(sub);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const getDaysRemaining = (endDate) => {
    if (!endDate) return null;
    const now = new Date();
    const end = new Date(endDate);
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return diff;
  };

  if (loading) {
    return (
      <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-12 text-center">
        <div className="inline-block w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm text-secondary">Loading subscriptions...</p>
      </div>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-primary-light/20 border-b border-theme sticky top-0 z-10 backdrop-blur-sm bg-surface/95">
              <tr>
                <th className="px-5 py-3.5 text-left text-sm font-medium text-theme">Restaurant</th>
                <th className="px-4 py-3.5 text-left text-sm font-medium text-theme">Package</th>
                <th className="px-4 py-3.5 text-left text-sm font-medium text-theme">Duration</th>
                <th className="px-4 py-3.5 text-left text-sm font-medium text-theme">Start Date</th>
                <th className="px-4 py-3.5 text-left text-sm font-medium text-theme">End Date</th>
                <th className="px-4 py-3.5 text-left text-sm font-medium text-theme">Status</th>
                <th className="px-4 py-3.5 text-left text-sm font-medium text-theme">Features</th>
                <th className="px-4 py-3.5 text-center text-sm font-medium text-theme w-20">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={8} className="px-4 py-24 text-center text-secondary">
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
    <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-primary-light/20 border-b border-theme sticky top-0 z-10 backdrop-blur-sm bg-surface/95">
            <tr>
              <th className="px-5 py-3.5 text-left text-sm font-medium text-theme">Restaurant</th>
              <th className="px-4 py-3.5 text-left text-sm font-medium text-theme">Package</th>
              <th className="px-4 py-3.5 text-left text-sm font-medium text-theme">Duration</th>
              <th className="px-4 py-3.5 text-left text-sm font-medium text-theme">Start Date</th>
              <th className="px-4 py-3.5 text-left text-sm font-medium text-theme">End Date</th>
              <th className="px-4 py-3.5 text-left text-sm font-medium text-theme">Status</th>
              <th className="px-4 py-3.5 text-left text-sm font-medium text-theme">Features</th>
              <th className="px-4 py-3.5 text-center text-sm font-medium text-theme w-20">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((sub) => {
              const subId = sub._id || sub.id;
              const daysRemaining = getDaysRemaining(sub.endDate);
              const isExpiring = sub.status === "expiring" || (sub.status === "active" && daysRemaining !== null && daysRemaining > 0 && daysRemaining <= 7);

              return (
                <tr key={subId} className="border-b border-theme hover:bg-primary-light/10 transition-colors">
                  <td className="px-5 py-3.5">
                    <div>
                      <p className="font-semibold text-theme text-sm">{sub.restaurantName}</p>
                      <p className="text-xs text-secondary truncate max-w-xs">{sub.adminName || sub.adminEmail || "-"}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-sm font-medium text-theme">{sub.packageName}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-sm text-theme">{sub.durationDisplay || (sub.duration ? `${sub.duration} Days` : "-")}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-sm text-secondary">{formatDate(sub.startDate)}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div>
                      <span className="text-sm font-medium text-theme">{formatDate(sub.endDate)}</span>
                      {isExpiring && daysRemaining !== null && daysRemaining > 0 && (
                        <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                          {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} left
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={sub.status} isExpiring={isExpiring} />
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center text-xs px-2.5 py-1 rounded-md bg-primary-light/30 text-theme font-medium">
                      {sub.features?.length || 0} Features
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <button 
                      data-dropdown-trigger="true"
                      onClick={(e) => handleToggleDropdown(e, sub)}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        dropdownMenu?.id === subId 
                          ? "text-primary bg-primary-light" 
                          : "text-secondary hover:text-theme hover:bg-primary-light/50"
                      }`}
                      title="Actions"
                    >
                      {dropdownMenu?.id === subId ? <X size={16} /> : <MoreHorizontal size={16} />}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Dropdown Portal - rendered into document.body to guarantee visibility without clipping */}
      {dropdownMenu && createPortal(
        <div 
          id="subscription-actions-dropdown"
          style={{
            position: "fixed",
            top: `${dropdownMenu.top}px`,
            right: `${dropdownMenu.right}px`,
            zIndex: 99999,
          }}
          className="bg-surface border border-theme rounded-xl shadow-2xl w-48 py-1.5 overflow-hidden animate-in fade-in duration-150"
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            onClick={() => handleActionClick(onView, dropdownMenu.sub)}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-theme hover:bg-primary-light/50 transition-colors cursor-pointer text-left"
          >
            <Eye size={14} className="text-secondary" /> View Details
          </button>
          <button 
            onClick={() => handleActionClick(onRenew, dropdownMenu.sub)}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-theme hover:bg-primary-light/50 transition-colors cursor-pointer text-left"
          >
            <RefreshCw size={14} className="text-primary" /> Renew
          </button>
          <button 
            onClick={() => handleActionClick(onChangePackage, dropdownMenu.sub)}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-theme hover:bg-primary-light/50 transition-colors cursor-pointer text-left"
          >
            <Package size={14} className="text-secondary" /> Change Package
          </button>
        </div>,
        document.body
      )}
    </div>
  );
}

function StatusBadge({ status, isExpiring }) {
  if (isExpiring) {
    return (
      <span 
        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
        style={{ backgroundColor: "#f59e0b20", color: "#f59e0b" }}
      >
        <Clock size={11} className="mr-1" />
        Expiring Soon
      </span>
    );
  }

  const config = {
    active: { label: "Active", bg: "#22c55e20", color: "#22c55e", icon: CheckCircle },
    expiring: { label: "Expiring Soon", bg: "#f59e0b20", color: "#f59e0b", icon: Clock },
    expired: { label: "Expired", bg: "#ef444420", color: "#ef4444", icon: XCircle },
    cancelled: { label: "Cancelled", bg: "#6b728020", color: "#6b7280", icon: XCircle },
    scheduled: { label: "Scheduled", bg: "#3b82f620", color: "#3b82f6", icon: Clock },
  };
  
  const current = config[status] || config.active;
  const Icon = current.icon;
  
  return (
    <span 
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
      style={{ backgroundColor: current.bg, color: current.color }}
    >
      <Icon size={11} className="mr-1" />
      {current.label}
    </span>
  );
}
