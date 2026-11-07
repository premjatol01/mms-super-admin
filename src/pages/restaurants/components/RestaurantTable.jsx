import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { MoreHorizontal, Eye, Edit2, Power, CreditCard, ToggleLeft, X, Mail } from "lucide-react";
import StatusBadge from "./StatusBadge";

export default function RestaurantTable({ 
  restaurants, 
  loading,
  selectedRestaurants = [], 
  onToggleSelect, 
  onToggleSelectAll,
  onView,
  onEdit,
  onToggleStatus,
  onManageSubscription,
  onManageFeatures,
  onSendInvite
}) {
  const [dropdownMenu, setDropdownMenu] = useState(null);

  const allSelected = restaurants.length > 0 && restaurants.every(r => selectedRestaurants.includes(r._id || r.id));

  const handleToggleDropdown = (e, restaurant) => {
    e.stopPropagation();
    const rId = restaurant._id || restaurant.id;
    if (dropdownMenu?.id === rId) {
      setDropdownMenu(null);
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const menuHeight = 250;
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUpward = spaceBelow < menuHeight && rect.top > menuHeight;

    setDropdownMenu({
      id: rId,
      restaurant,
      top: openUpward ? rect.top - menuHeight - 4 : rect.bottom + 4,
      right: Math.max(16, window.innerWidth - rect.right),
    });
  };

  const handleActionClick = (action, restaurant) => {
    setDropdownMenu(null);
    if (typeof action === 'function') {
      action(restaurant);
    }
  };

  // Close dropdown on click outside, window scroll, or resize
  useEffect(() => {
    if (!dropdownMenu) return;

    const handleClickOutside = (event) => {
      const menuEl = document.getElementById("restaurant-actions-dropdown");
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

  if (!loading && restaurants.length === 0) {
    return (
      <div className="bg-surface border border-theme rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-primary-light/20 border-b border-theme">
              <tr>
                <th className="w-12 min-w-[48px] max-w-[48px] px-3 py-3.5 text-center">
                  <input type="checkbox" checked={false} onChange={() => {}} className="rounded border-theme opacity-50 cursor-not-allowed" disabled />
                </th>
                <th className="px-4 py-3.5 text-left text-sm font-medium text-theme min-w-[220px]">Restaurant</th>
                <th className="px-4 py-3.5 text-left text-sm font-medium text-theme w-36 min-w-[140px]">Admin</th>
                <th className="px-4 py-3.5 text-left text-sm font-medium text-theme w-48 min-w-[180px]">Email</th>
                <th className="px-4 py-3.5 text-left text-sm font-medium text-theme w-32 min-w-[120px]">Phone</th>
                <th className="px-4 py-3.5 text-left text-sm font-medium text-theme w-28 min-w-[110px]">Location</th>
                <th className="px-4 py-3.5 text-left text-sm font-medium text-theme w-28 min-w-[110px]">Package</th>
                <th className="px-4 py-3.5 text-left text-sm font-medium text-theme w-28 min-w-[110px]">Sub. Status</th>
                <th className="px-4 py-3.5 text-left text-sm font-medium text-theme w-24 min-w-[90px]">Status</th>
                <th className="px-4 py-3.5 text-left text-sm font-medium text-theme w-28 min-w-[110px]">Created</th>
                <th className="px-3 py-3.5 text-center text-sm font-medium text-theme w-16 min-w-[64px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={11} className="px-4 py-16 text-center text-secondary">
                  No restaurants found
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-theme rounded-xl overflow-hidden shadow-sm flex flex-col h-full">
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead className="bg-primary-light/20 border-b border-theme">
            <tr>
              <th className="w-12 min-w-[48px] max-w-[48px] px-3 py-3.5 text-center">
                <input 
                  type="checkbox" 
                  checked={allSelected} 
                  onChange={onToggleSelectAll} 
                  className="rounded border-theme cursor-pointer" 
                />
              </th>
              <th className="px-4 py-3.5 text-left text-sm font-medium text-theme min-w-[220px]">Restaurant</th>
              <th className="px-4 py-3.5 text-left text-sm font-medium text-theme w-36 min-w-[140px]">Admin</th>
              <th className="px-4 py-3.5 text-left text-sm font-medium text-theme w-48 min-w-[180px]">Email</th>
              <th className="px-4 py-3.5 text-left text-sm font-medium text-theme w-32 min-w-[120px]">Phone</th>
              <th className="px-4 py-3.5 text-left text-sm font-medium text-theme w-28 min-w-[110px]">Location</th>
              <th className="px-4 py-3.5 text-left text-sm font-medium text-theme w-28 min-w-[110px]">Package</th>
              <th className="px-4 py-3.5 text-left text-sm font-medium text-theme w-28 min-w-[110px]">Sub. Status</th>
              <th className="px-4 py-3.5 text-left text-sm font-medium text-theme w-24 min-w-[90px]">Status</th>
              <th className="px-4 py-3.5 text-left text-sm font-medium text-theme w-28 min-w-[110px]">Created</th>
              <th className="px-3 py-3.5 text-center text-sm font-medium text-theme w-16 min-w-[64px]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {restaurants.map((restaurant) => {
              const rId = restaurant._id || restaurant.id;
              const isSelected = selectedRestaurants.includes(rId);
              return (
                <tr 
                  key={rId} 
                  className={`border-b border-theme transition-colors ${
                    isSelected ? "bg-primary-light/15" : "hover:bg-primary-light/10"
                  }`}
                >
                  <td className="w-12 min-w-[48px] max-w-[48px] px-3 py-3 text-center align-middle">
                    <input 
                      type="checkbox" 
                      checked={isSelected} 
                      onChange={() => onToggleSelect(rId)} 
                      className="rounded border-theme cursor-pointer" 
                    />
                  </td>
                  <td className="px-4 py-3 min-w-[220px]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white font-medium text-sm flex-shrink-0 overflow-hidden shadow-sm">
                        {restaurant.logo ? (
                          <img 
                            src={restaurant.logo.startsWith('http') ? restaurant.logo : `${(import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace('/api', '')}${restaurant.logo}`} 
                            alt={restaurant.name} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          (restaurant.name || 'R')[0]?.toUpperCase()
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-theme truncate">{restaurant.name}</p>
                        <p className="text-xs text-secondary">ID: {rId.slice(-6)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 w-36 min-w-[140px]">
                    <p className="text-sm text-theme truncate">{restaurant.admin?.name || '-'}</p>
                  </td>
                  <td className="px-4 py-3 w-48 min-w-[180px]">
                    <p className="text-sm text-theme truncate" title={restaurant.admin?.email}>{restaurant.admin?.email || '-'}</p>
                  </td>
                  <td className="px-4 py-3 w-32 min-w-[120px]">
                    <p className="text-sm text-theme whitespace-nowrap">{restaurant.admin?.phone || '-'}</p>
                  </td>
                  <td className="px-4 py-3 w-28 min-w-[110px]">
                    <p className="text-sm text-theme truncate">{restaurant.address?.city || '-'}</p>
                  </td>
                  <td className="px-4 py-3 w-28 min-w-[110px]">
                    <p className="text-sm text-theme truncate">{restaurant.subscription?.packageName || restaurant.subscription?.package || '-'}</p>
                  </td>
                  <td className="px-4 py-3 w-28 min-w-[110px]">
                    <StatusBadge status={restaurant.subscription?.status} type="subscription" />
                  </td>
                  <td className="px-4 py-3 w-24 min-w-[90px]">
                    <StatusBadge status={restaurant.status} />
                  </td>
                  <td className="px-4 py-3 w-28 min-w-[110px]">
                    <p className="text-sm text-theme whitespace-nowrap">
                      {restaurant.createdAt ? new Date(restaurant.createdAt).toLocaleDateString() : '-'}
                    </p>
                  </td>
                  <td className="px-3 py-3 w-16 min-w-[64px] text-center align-middle">
                    <button 
                      data-dropdown-trigger="true"
                      onClick={(e) => handleToggleDropdown(e, restaurant)}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        dropdownMenu?.id === rId 
                          ? "text-primary bg-primary-light" 
                          : "text-secondary hover:text-theme hover:bg-primary-light/50"
                      }`}
                      title="Actions"
                    >
                      {dropdownMenu?.id === rId ? <X size={16} /> : <MoreHorizontal size={16} />}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Dropdown Portal */}
      {dropdownMenu && createPortal(
        <div 
          id="restaurant-actions-dropdown"
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
            onClick={() => handleActionClick(onView, dropdownMenu.restaurant)}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-theme hover:bg-primary-light/40 transition-colors text-left cursor-pointer"
          >
            <Eye size={15} className="text-secondary" /> 
            <span>View Details</span>
          </button>
          <button 
            onClick={() => handleActionClick(onEdit, dropdownMenu.restaurant)}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-theme hover:bg-primary-light/40 transition-colors text-left cursor-pointer"
          >
            <Edit2 size={15} className="text-secondary" /> 
            <span>Edit</span>
          </button>
          <button 
            onClick={() => handleActionClick(onManageSubscription, dropdownMenu.restaurant)}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-theme hover:bg-primary-light/40 transition-colors text-left cursor-pointer"
          >
            <CreditCard size={15} className="text-secondary" /> 
            <span>Subscription</span>
          </button>
          <button 
            onClick={() => handleActionClick(onManageFeatures, dropdownMenu.restaurant)}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-theme hover:bg-primary-light/40 transition-colors text-left cursor-pointer"
          >
            <ToggleLeft size={15} className="text-secondary" /> 
            <span>Features</span>
          </button>
          <button 
            onClick={() => handleActionClick(onSendInvite, dropdownMenu.restaurant)}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-theme hover:bg-primary-light/40 transition-colors text-left cursor-pointer"
          >
            <Mail size={15} className="text-secondary" /> 
            <span>Send Invite</span>
          </button>
          <div className="h-px bg-theme my-1 opacity-60" />
          <button 
            onClick={() => handleActionClick(onToggleStatus, dropdownMenu.restaurant)}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-sm transition-colors text-left cursor-pointer ${
              dropdownMenu.restaurant.status === "active" 
                ? "text-red-500 hover:bg-red-500/10" 
                : "text-green-600 hover:bg-green-500/10"
            }`}
          >
            <Power size={15} /> 
            <span>{dropdownMenu.restaurant.status === "active" ? "Deactivate" : "Activate"}</span>
          </button>
        </div>,
        document.body
      )}
    </div>
  );
}
