import { useState, useRef, useEffect } from "react";
import { MoreHorizontal, Eye, Edit2, Power, CreditCard, ToggleLeft, X } from "lucide-react";
import StatusBadge from "./StatusBadge";

export default function RestaurantTable({ 
  restaurants, 
  selectedRestaurants, 
  onToggleSelect, 
  onToggleSelectAll,
  onView,
  onEdit,
  onToggleStatus,
  onManageSubscription,
  onManageFeatures 
}) {
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const containerRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const allSelected = restaurants.length > 0 && restaurants.every(r => selectedRestaurants.includes(r.id));

  const handleActionClick = (action, restaurant) => {
    setOpenDropdownId(null);
    action(restaurant);
  };

  if (restaurants.length === 0) {
    return (
      <div className="bg-surface border border-theme rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-primary-light/20">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input type="checkbox" checked={false} onChange={() => {}} className="rounded border-theme opacity-50" disabled />
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-theme w-48">Restaurant</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-theme w-32">Admin</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-theme w-40">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-theme w-28">Phone</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-theme w-24">Location</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-theme w-24">Package</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-theme w-24">Sub. Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-theme w-20">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-theme w-24">Created</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-theme w-16">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={11} className="px-4 py-12 text-center text-secondary">
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
    <div className="bg-surface border border-theme rounded-xl overflow-hidden" ref={containerRef}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-primary-light/20">
            <tr>
              <th className="px-4 py-3 text-left">
                <input 
                  type="checkbox" 
                  checked={allSelected} 
                  onChange={onToggleSelectAll} 
                  className="rounded border-theme" 
                />
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-theme w-48">Restaurant</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-theme w-32">Admin</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-theme w-40">Email</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-theme w-28">Phone</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-theme w-24">Location</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-theme w-24">Package</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-theme w-24">Sub. Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-theme w-20">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-theme w-24">Created</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-theme w-16">Actions</th>
            </tr>
          </thead>
          <tbody>
            {restaurants.map((restaurant) => (
              <tr key={restaurant.id} className="border-b border-theme hover:bg-primary-light/10 transition-colors">
                <td className="px-4 py-3">
                  <input 
                    type="checkbox" 
                    checked={selectedRestaurants.includes(restaurant.id)} 
                    onChange={() => onToggleSelect(restaurant.id)} 
                    className="rounded border-theme" 
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white font-medium text-sm flex-shrink-0">
                      {restaurant.logo ? (
                        <img src={restaurant.logo} alt="" className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        restaurant.name[0]
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-theme truncate">{restaurant.name}</p>
                      <p className="text-xs text-secondary">ID: {restaurant.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm text-theme truncate">{restaurant.admin?.name}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm text-theme truncate">{restaurant.admin?.email}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm text-theme">{restaurant.admin?.phone}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm text-theme">{restaurant.address?.city}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm text-theme">{restaurant.subscription?.package}</p>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={restaurant.subscription?.status} type="subscription" />
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={restaurant.status} />
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm text-theme">{restaurant.createdAt}</p>
                </td>
                <td className="px-4 py-3 relative">
                  <div className="relative">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenDropdownId(openDropdownId === restaurant.id ? null : restaurant.id);
                      }}
                      className="p-1.5 text-secondary hover:text-theme hover:bg-primary-light rounded-lg transition-colors"
                    >
                      {openDropdownId === restaurant.id ? <X size={16} /> : <MoreHorizontal size={16} />}
                    </button>
                    
                    {openDropdownId === restaurant.id && (
                      <div className="absolute right-0 top-full mt-1 bg-surface border border-theme rounded-lg shadow-lg z-20 w-44">
                        <button 
                          onClick={() => handleActionClick(onView, restaurant)}
                          className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-theme hover:bg-primary-light rounded-t-lg transition-colors"
                        >
                          <Eye size={14} /> View Details
                        </button>
                        <button 
                          onClick={() => handleActionClick(onEdit, restaurant)}
                          className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-theme hover:bg-primary-light transition-colors"
                        >
                          <Edit2 size={14} /> Edit
                        </button>
                        <button 
                          onClick={() => handleActionClick(onManageSubscription, restaurant)}
                          className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-theme hover:bg-primary-light transition-colors"
                        >
                          <CreditCard size={14} /> Subscription
                        </button>
                        <button 
                          onClick={() => handleActionClick(onManageFeatures, restaurant)}
                          className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-theme hover:bg-primary-light transition-colors"
                        >
                          <ToggleLeft size={14} /> Features
                        </button>
                        <button 
                          onClick={() => handleActionClick(onToggleStatus, restaurant)}
                          className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm rounded-b-lg transition-colors ${
                            restaurant.status === "active" 
                              ? "text-red-600 hover:bg-red-50" 
                              : "text-green-600 hover:bg-green-50"
                          }`}
                        >
                          <Power size={14} /> {restaurant.status === "active" ? "Deactivate" : "Activate"}
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}