import { useState, useRef, useEffect } from "react";
import { MoreHorizontal, Eye, Edit2, Power, X } from "lucide-react";

export default function PackageTable({ 
  packages, 
  onView,
  onEdit,
  onToggleStatus,
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

  const handleActionClick = (action, pkg) => {
    setOpenDropdownId(null);
    action(pkg);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  if (packages.length === 0) {
    return (
      <div className="bg-surface border border-theme rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-primary-light/20">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-theme w-40">Package</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-theme w-32">Duration</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-theme w-32">Features</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-theme w-24">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-theme w-28">Created</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-theme w-28">Updated</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-theme w-16">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-secondary">
                  No packages found
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
              <th className="px-4 py-3 text-left text-sm font-medium text-theme w-40">Package</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-theme w-32">Duration</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-theme w-32">Features</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-theme w-24">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-theme w-28">Created</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-theme w-28">Updated</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-theme w-16">Actions</th>
            </tr>
          </thead>
          <tbody>
            {packages.map((pkg) => (
              <tr key={pkg.id} className="border-b border-theme hover:bg-primary-light/10 transition-colors">
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium text-theme">{pkg.name}</p>
                    <p className="text-xs text-secondary">{pkg.id}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-theme">{pkg.durationDisplay}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-theme">{pkg.features?.length || 0} Features</span>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={pkg.status} />
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-secondary">{formatDate(pkg.createdAt)}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-secondary">{formatDate(pkg.updatedAt)}</span>
                </td>
                <td className="px-4 py-3 relative">
                  <div className="relative">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenDropdownId(openDropdownId === pkg.id ? null : pkg.id);
                      }}
                      className="p-1.5 text-secondary hover:text-theme hover:bg-primary-light rounded-lg transition-colors"
                    >
                      {openDropdownId === pkg.id ? <X size={16} /> : <MoreHorizontal size={16} />}
                    </button>
                    
                    {openDropdownId === pkg.id && (
                      <div className="absolute right-0 top-full mt-1 bg-surface border border-theme rounded-lg shadow-lg z-20 w-40">
                        <button 
                          onClick={() => handleActionClick(onView, pkg)}
                          className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-theme hover:bg-primary-light rounded-t-lg transition-colors"
                        >
                          <Eye size={14} /> View
                        </button>
                        <button 
                          onClick={() => handleActionClick(onEdit, pkg)}
                          className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-theme hover:bg-primary-light transition-colors"
                        >
                          <Edit2 size={14} /> Edit
                        </button>
                        <button 
                          onClick={() => handleActionClick(onToggleStatus, pkg)}
                          className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm rounded-b-lg transition-colors ${
                            pkg.status === "active" 
                              ? "text-red-600 hover:bg-red-50" 
                              : "text-green-600 hover:bg-green-50"
                          }`}
                        >
                          <Power size={14} /> {pkg.status === "active" ? "Deactivate" : "Activate"}
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

function StatusBadge({ status }) {
  const isActive = status === "active";
  
  return (
    <span 
      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
      style={{ 
        backgroundColor: isActive ? "#22c55e20" : "#ef444420",
        color: isActive ? "#22c55e" : "#ef4444"
      }}
    >
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}